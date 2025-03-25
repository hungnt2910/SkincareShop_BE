import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Quiz, QuizChoice, SkinType, SkinTypeResult, User } from 'src/typeorm/entities'
import { Repository } from 'typeorm'
import { QuizAnswerDto } from './dto/QuizAnswer.dto'

const skinResult = ['Da thường', 'Da dầu', 'Da khô', 'Da nhạy cảm']

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SkinTypeResult)
    private readonly skinTypeResultRepository: Repository<SkinTypeResult>,
    @InjectRepository(SkinType)
    private readonly skinTypeRepository: Repository<SkinType>
  ) {}

  async getQuiz() {
    return await this.quizRepository.find({
      relations: ['choices'],
      order: { quizId: 'ASC', choices: { quizChoiceId: 'ASC' } }
    })
  }

  async checkQuiz(userId: number, userAnswer: QuizAnswerDto[]) {
    const quizList = await this.getQuiz()

    // Get skin types from the database
    const skinTypes = await this.skinTypeRepository.find({ order: { skinTypeId: 'ASC' } })
    if (skinTypes.length === 0) throw new BadGatewayException('No skin types available in the database')

    // Extract user's chosen answer indices
    const userAnswerList: number[] = quizList.flatMap(
      (quiz) =>
        userAnswer
          .filter((userAn) => userAn.quizId === quiz.quizId)
          .map((userAn) => quiz.choices.findIndex((choice) => choice.quizChoiceId === userAn.quizAnswer))
          .filter((index) => index !== -1) // Exclude invalid answers
    )

    if (userAnswerList.length === 0) {
      throw new BadGatewayException('The quiz does not have an answer')
    }

    // Count occurrences of each answer index
    const countMap = new Map<number, number>()
    let countMax = 0
    let mostFrequent = userAnswerList[0]

    for (const num of userAnswerList) {
      const count = (countMap.get(num) || 0) + 1
      countMap.set(num, count)

      if (count > countMax) {
        countMax = count
        mostFrequent = num
      }
    }

    // Ensure the selected skin type index exists in the database
    if (mostFrequent < 0 || mostFrequent >= skinTypes.length) {
      throw new BadGatewayException('Invalid skin type result')
    }

    // Get the final detected skin type from the database
    const detectedSkinType = skinTypes[mostFrequent].type

    const result = await this.saveSkinTypeResult(userId, detectedSkinType)

    return result.skinTypeResultId
  }

  async saveSkinTypeResult(userId: number, detectedSkinType: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new BadGatewayException('User not found')

    const skinType = await this.skinTypeRepository.findOne({ where: { type: detectedSkinType } })
    if (!skinType) throw new BadGatewayException('Skin type not found')

    const isSubmit = await this.skinTypeResultRepository.find({ where: { customer: { id: userId } } })

    if(isSubmit){
      throw new BadRequestException('Quiz only do one time')
    }

    const skinTypeResult = this.skinTypeResultRepository.create({
      customer: user,
      skinType: skinType,
      resultTime: new Date().toISOString()
    })

    return this.skinTypeResultRepository.save(skinTypeResult)
  }
}
