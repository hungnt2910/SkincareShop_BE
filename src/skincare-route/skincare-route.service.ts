import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CareRoute, User } from 'src/typeorm/entities'
import { Repository } from 'typeorm'
import { CreateSkincareRoutineDto } from './dtos/create-skincare-routine.dto';

@Injectable()
export class SkincareRouteService {
  constructor(@InjectRepository(CareRoute) private readonly careRouteRepository: Repository<CareRoute>,
  @InjectRepository(User) private readonly userRepository: Repository<User>
) {}

  async createSkincareRoutine(createSkincareRoutineDto: CreateSkincareRoutineDto){
    const user = await this.userRepository.findOne({ where: { id: createSkincareRoutineDto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const skincareRoutine = this.careRouteRepository.create({
      user,
      ...createSkincareRoutineDto,
    });

    return this.careRouteRepository.save(skincareRoutine);
  }
  

  async getUserSkincareRoutine(userId: number) {
    return this.careRouteRepository.find({ where: { user: { id: userId } } });
  }
}
