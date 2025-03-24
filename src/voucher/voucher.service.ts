import { BadRequestException, Injectable, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserVoucher, Voucher } from 'src/typeorm/entities'
import { Repository } from 'typeorm'
import { applyVoucherDto, claimVoucherDto, createVoucherDto, updateVoucherDto } from './dtos/voucher-dto'

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(UserVoucher)
    private userVoucherRepository: Repository<UserVoucher>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createVoucher(createVoucherDto: createVoucherDto) {
    const { code, discount, expirationDate } = createVoucherDto

    const existingCode = await this.voucherRepository.findOne({ where: { code } })

    if (existingCode) {
      throw new BadRequestException(`Voucher code "${code}" already exists`)
    }

    const existingVoucher = await this.voucherRepository.findOne({
      where: { discount, expirationDate }
    })

    if (existingVoucher) {
      throw new BadRequestException(
        `A voucher with discount ${discount}% and expiration date ${expirationDate} already exists`
      )
    }

    const voucher = new Voucher()
    voucher.code = code
    voucher.discount = discount
    voucher.expirationDate = expirationDate

    try {
      return await this.voucherRepository.save(voucher)
    } catch (error) {
      // if (error?.code === 'ER_DUP_ENTRY') {
      //   throw new BadRequestException(`Voucher code "${code}" already exists`)
      // }
      throw error
    }
  }

  async updateVoucher(voucherId: number, updateVoucherDto: updateVoucherDto) {
    const voucher = await this.voucherRepository.findOne({ where: { voucherId: voucherId } })

    if (!voucher) {
      throw new Error(`Voucher with id ${voucherId} not found`)
    }

    if (updateVoucherDto.discount !== undefined) {
      voucher.discount = updateVoucherDto.discount
    }

    if (updateVoucherDto.expirationDate !== undefined) {
      voucher.expirationDate = updateVoucherDto.expirationDate
    }

    await this.voucherRepository.save(voucher)

    return {
      success: true,
      message: 'Voucher updated successfully'
    }
  }

  async claimVoucher(claimVoucherDto: claimVoucherDto) {
    const voucher = await this.voucherRepository.findOne({
      where: { voucherId: claimVoucherDto.voucherId }
    })

    const user = await this.userRepository.findOne({
      where: { id: claimVoucherDto.userId }
    })
    if (!user) {
      throw new BadRequestException(`User with id ${claimVoucherDto.userId} not found`)
    }

    const theVoucher = await this.voucherRepository.findOne({
      where: { voucherId: claimVoucherDto.voucherId }
    })
    if (!theVoucher) {
      throw new BadRequestException(`Voucher with id ${claimVoucherDto.voucherId} not found`)
    }

    if (!voucher) {
      throw new BadRequestException(`Voucher with id ${claimVoucherDto.voucherId} not found`)
    }

    const currentDate = new Date()
    if (voucher.expirationDate < currentDate) {
      throw new BadRequestException(`Voucher with id ${claimVoucherDto.voucherId} has expired`)
    }

    const existingClaim = await this.userVoucherRepository.findOne({
      where: { user: { id: claimVoucherDto.userId }, voucher: { voucherId: claimVoucherDto.voucherId } }
    })

    if (existingClaim) {
      throw new BadRequestException(
        `Voucher with id ${claimVoucherDto.voucherId} has already been claimed by this user`
      )
    }

    const usedVoucher = await this.userVoucherRepository.findOne({
      where: { user: { id: claimVoucherDto.userId }, voucher: { voucherId: claimVoucherDto.voucherId }, used: true }
    })

    if (usedVoucher) {
      throw new BadRequestException(`Voucher with id ${claimVoucherDto.voucherId} has already been used by this user`)
    }

    const claimedVoucher = new UserVoucher()
    claimedVoucher.user = user
    claimedVoucher.voucher = theVoucher

    await this.userVoucherRepository.save(claimedVoucher)

    return {
      success: true,
      message: 'Voucher claimed successfully'
    }
  }

  async getAllVouchers() {
    return await this.voucherRepository.find()
  }

  async applyVoucher(applyVoucherDto: applyVoucherDto) {
    const user = await this.userRepository.findOne({ where: { id: applyVoucherDto.userId } })
    if (!user) {
      throw new BadRequestException(`User with id ${applyVoucherDto.userId} not found`)
    }

    const voucher = await this.voucherRepository.findOne({ where: { code: applyVoucherDto.voucherCode } })
    if (!voucher) {
      throw new BadRequestException(`Voucher with code ${applyVoucherDto.voucherCode} not found`)
    }

    const currentDate = new Date()
    if (voucher.expirationDate < currentDate) {
      throw new BadRequestException(`Voucher with code ${applyVoucherDto.voucherCode} has expired`)
    }

    const userVoucher = await this.userVoucherRepository.findOne({
      where: { user: { id: applyVoucherDto.userId }, voucher: { code: applyVoucherDto.voucherCode } }
    })

    if (!userVoucher) {
      throw new BadRequestException(
        `Voucher with code ${applyVoucherDto.voucherCode} has not been claimed by this user`
      )
    }

    if (userVoucher.used) {
      throw new BadRequestException(
        `Voucher with code ${applyVoucherDto.voucherCode} has already been used by this user`
      )
    }

    userVoucher.used = true
    await this.userVoucherRepository.save(userVoucher)

    return {
      success: true,
      message: 'Voucher applied successfully',
      discount: voucher.discount
    }
  }

  async getVoucherByUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`)
    }

    return await this.userVoucherRepository.find({
      where: { user: { id: userId } },
      relations: ['voucher'],
      select: {
        id: true,
        used: true,
        voucher: {
          voucherId: true,
          code: true,
          discount: true,
          expirationDate: true
        }
      }
    })
  }
}
