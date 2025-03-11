import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brand } from 'src/typeorm/entities'
import { Repository } from 'typeorm'

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly BrandRepository: Repository<Brand>
  ) {}

  
  async getAllBrand(){
    return await this.BrandRepository.find()
  }
}
