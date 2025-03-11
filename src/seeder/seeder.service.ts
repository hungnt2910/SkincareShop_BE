import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Brand,
  Category,
  Quiz,
  QuizChoice,
  Role,
  SkincareProduct,
  SkincareProductDetails,
  SkinType,
  User
} from 'src/typeorm/entities'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SkincareProduct)
    private readonly productRepository: Repository<SkincareProduct>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SkinType)
    private readonly skinTypeRepository: Repository<SkinType>,
    @InjectRepository(SkincareProductDetails)
    private readonly skincareProductDetailsRepository: Repository<SkincareProductDetails>
  ) {}

  async onModuleInit() {
    //   console.log('🌱 Seeding Role...')
    //   const defaultRoles = [{ roleName: 'Admin' }, { roleName: 'User' }, {roleName: 'Staff'}, {roleName: 'Shipper'}]
    //   for (const role of defaultRoles) {
    //     const exists = await this.roleRepository.findOne({ where: { roleName: role.roleName } })
    //     if (!exists) {
    //       await this.roleRepository.save(role)
    //     }
    //   }
    //     console.log('🌱 Seeding Categories and Brands...')
    //   const users = [
    //     {
    //       id: 1,
    //       username: 'admin_user',
    //       password: await bcrypt.hash('admin123', 10), // Hash password
    //       phone: '1234567890',
    //       address: '123 Admin St',
    //       email: 'admin@example.com',
    //       status: true,
    //       role: { roleId: 1 } // Admin role
    //     },
    //     {
    //       id: 2,
    //       username: 'regular_user',
    //       password: await bcrypt.hash('user123', 10), // Hash password
    //       phone: '0987654321',
    //       address: '456 User Rd',
    //       email: 'user@example.com',
    //       status: true,
    //       role: { roleId: 2 } // User role
    //     }
    //   ]
    //   for (const user of users) {
    //     const existingUser = await this.userRepository.findOneBy({ id: user.id })
    //     if (!existingUser) {
    //       await this.userRepository.save(user)
    //     }
    //   }
    //     // ✅ Predefined category names
    //     const categoryNames = [
    //       'Cleanser',
    //       'Toner',
    //       'Moisturizer',
    //       'Serum',
    //       'Essence',
    //       'Sunscreen',
    //       'Exfoliator',
    //       'Eye Cream',
    //       'Face Mask',
    //       'Night Cream'
    //     ]
    //     // ✅ Predefined brand names
    //     const brandNames = [
    //       { name: 'Klairs', country: 'South Korea', logo: 'https://example.com/klairs.png' },
    //       { name: 'COSRX', country: 'South Korea', logo: 'https://example.com/cosrx.png' },
    //       { name: 'CeraVe', country: 'USA', logo: 'https://example.com/cerave.png' },
    //       { name: 'La Roche-Posay', country: 'France', logo: 'https://example.com/larocheposay.png' },
    //       { name: 'The Ordinary', country: 'Canada', logo: 'https://example.com/theordinary.png' },
    //       { name: "L'Oréal Paris", country: 'France', logo: 'https://example.com/loreal.png' },
    //       { name: 'Neutrogena', country: 'USA', logo: 'https://example.com/neutrogena.png' },
    //       { name: "Paula's Choice", country: 'USA', logo: 'https://example.com/paulaschoice.png' },
    //       { name: 'Olay', country: 'USA', logo: 'https://example.com/olay.png' },
    //       { name: 'Cetaphil', country: 'USA', logo: 'https://example.com/cetaphil.png' },
    //       { name: 'Eucerin', country: 'Germany', logo: 'https://example.com/eucerin.png' },
    //       { name: 'Bioderma', country: 'France', logo: 'https://example.com/bioderma.png' },
    //       { name: 'Aveeno', country: 'USA', logo: 'https://example.com/aveeno.png' },
    //       { name: 'Kiehl’s', country: 'USA', logo: 'https://example.com/kiehls.png' },
    //       { name: 'SK-II', country: 'Japan', logo: 'https://example.com/sk2.png' },
    //       { name: 'Shiseido', country: 'Japan', logo: 'https://example.com/shiseido.png' },
    //       { name: 'Drunk Elephant', country: 'USA', logo: 'https://example.com/drunkelephant.png' },
    //       { name: 'Tatcha', country: 'Japan', logo: 'https://example.com/tatcha.png' },
    //       { name: 'Estée Lauder', country: 'USA', logo: 'https://example.com/esteelauder.png' },
    //       { name: 'Clarins', country: 'France', logo: 'https://example.com/clarins.png' },
    //       { name: 'Lancôme', country: 'France', logo: 'https://example.com/lancome.png' },
    //       { name: 'Murad', country: 'USA', logo: 'https://example.com/murad.png' }
    //     ]
    //     // Insert categories if not exist
    //     for (const name of categoryNames) {
    //       const existingCategory = await this.categoryRepository.findOne({ where: { name: name } })
    //       if (!existingCategory) {
    //         const category = new Category()
    //         category.name = name
    //         await this.categoryRepository.save(category)
    //       }
    //     }
    //     // Insert brands if not exist
    //     for (const { name, country, logo } of brandNames) {
    //       const existingBrand = await this.brandRepository.findOne({ where: { brandName: name } })
    //       if (!existingBrand) {
    //         const brand = new Brand()
    //         brand.brandName = name
    //         brand.country = country
    //         brand.logo = logo
    //         await this.brandRepository.save(brand)
    //       }
    //     }
    //     console.log('✅ Categories and Brands seeded successfully!')
    //     console.log('🌱 Seeding Skincare Products...')
    //     const categories = await this.categoryRepository.find()
    //     const brandList = await this.brandRepository.find()
    //     if (categories.length === 0 || brandList.length === 0) {
    //       console.error('⚠️ Please insert some categories and brands first!')
    //       return
    //     }
    //     // ✅ Expanded skincare product list
    //     const skincareProducts = [
    //       { name: 'Klairs Supple Preparation Toner', brand: 'Klairs', category: 'Toner', price: 100000, stock: 50 },
    //       {
    //         name: 'COSRX Advanced Snail 96 Mucin Power Essence',
    //         brand: 'COSRX',
    //         category: 'Serum',
    //         price: 23.0,
    //         stock: 45
    //       },
    //       { name: 'CeraVe Hydrating Facial Cleanser', brand: 'CeraVe', category: 'Cleanser', price: 129000, stock: 100 },
    //       {
    //         name: 'La Roche-Posay Toleriane Hydrating Gentle Cleanser',
    //         brand: 'La Roche-Posay',
    //         category: 'Cleanser',
    //         price: 129000,
    //         stock: 80
    //       },
    //       {
    //         name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    //         brand: 'The Ordinary',
    //         category: 'Serum',
    //         price: 159000,
    //         stock: 120
    //       },
    //       {
    //         name: "L'Oréal Revitalift Hyaluronic Acid Serum",
    //         brand: "L'Oréal Paris",
    //         category: 'Serum',
    //         price: 159000,
    //         stock: 60
    //       },
    //       {
    //         name: 'Neutrogena Hydro Boost Water Gel',
    //         brand: 'Neutrogena',
    //         category: 'Moisturizer',
    //         price: 159000,
    //         stock: 90
    //       },
    //       {
    //         name: "Paula's Choice 2% BHA Liquid Exfoliant",
    //         brand: "Paula's Choice",
    //         category: 'Exfoliator',
    //         price: 179000,
    //         stock: 55
    //       },
    //       {
    //         name: 'Olay Regenerist Micro-Sculpting Cream',
    //         brand: 'Olay',
    //         category: 'Moisturizer',
    //         price: 200000,
    //         stock: 70
    //       },
    //       { name: 'SK-II Facial Treatment Essence', brand: 'SK-II', category: 'Essence', price: 219000, stock: 20 }
    //     ]
    //     const productImage = [
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FFTE_1_2__11815.jpg?alt=media&token=4d586012-b309-4a59-9a65-5b767d2fd895',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCTH-222018-front-zoom.jpg?alt=media&token=a7064e14-a5a1-4669-ae0b-26e7535b4b53',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-200024-front-zoom.jpg?alt=media&token=b254a615-42d5-473c-b5e3-557ae2ce6419',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-204108-front-zoom.jpg?alt=media&token=ec68c3bc-85d1-462f-b06a-ad0cc6216857',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-207700-front-zoom%20(1).jpg?alt=media&token=7cbc3728-a531-45c1-b5a7-5763f638f25b',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-209586-front-H7otko4A-zoom.jpg?alt=media&token=634e181f-90fb-499b-a2ae-5f091de8d25e',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-210804-front-utEdKwsN-zoom.jpg?alt=media&token=74064b85-a892-4060-b823-ae20c9f4b6bd',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-212617-front-fELquHwA-zoom.jpg?alt=media&token=3250cfd0-2fcc-45f0-af74-ed40e6029026',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2FWTCVN-214649-front-cAotDWTM-zoom.jpg?alt=media&token=f3821743-ea3d-4355-96f5-a23b38ab14b7',
    //       'https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/skinCare%2Fthe-ordinary-niacinamide-10-zinc-1-30ml-510x510.jpg?alt=media&token=104475d8-dab7-446d-8e31-8beb5ef6efcd'
    //     ]
    //     // ✅ Expanding to 100 products with variations
    //     const products: SkincareProduct[] = []
    //     for (let i = 0; i < 100; i++) {
    //       const data = skincareProducts[i % skincareProducts.length]
    //       const category = categories.find((cat) => cat.name === data.category)
    //       const brand = brandList.find((br) => br.brandName === data.brand)
    //       if (!category || !brand) continue
    //       const product = new SkincareProduct()
    //       product.productName = `${data.name} - Version ${i + 1}`
    //       product.description = `A highly effective ${data.category.toLowerCase()} by ${data.brand}.`
    //       product.price = parseFloat((data.price + (Math.random() * 5 - 2.5)).toFixed(2))
    //       product.stock = Math.floor(Math.random() * (data.stock - 20)) + 20
    //       product.category = category
    //       product.brand = brand
    //       product.isActive = Math.random() > 0.1 // 90% chance to be active
    //       product.urlImage = productImage[i % productImage.length] // Assign a random image from the list
    //       products.push(product)
    //     }
    //     await this.productRepository.save(products)
    //     console.log('✅ 100 Skincare Products with Images seeded successfully!')
    // const skincareProducts = await this.productRepository.find()
    // const productDetails: SkincareProductDetails[] = []
    // for (const product of skincareProducts) {
    //   const productionDate = new Date()
    //   productionDate.setMonth(productionDate.getMonth() - Math.floor(Math.random() * 12))
    //   const expirationDate = new Date(productionDate)
    //   expirationDate.setFullYear(expirationDate.getFullYear() + 2)
    //   const productDetail = new SkincareProductDetails()
    //   productDetail.product = product
    //   productDetail.productionDate = productionDate
    //   productDetail.expirationDate = expirationDate
    //   productDetail.quantity = Math.floor(Math.random() * 100) + 20
    //   productDetails.push(productDetail)
    // }
    // await this.skincareProductDetailsRepository.save(productDetails)
    // console.log('Seeder data for product details inserted')
    //     const quizData = [
    //       {
    //         title: 'Vào mỗi buổi sáng thức dậy, bạn thấy da mình thế nào ?',
    //         answer: [
    //           'Bình thường. Không có sự khác biệt so với trước khi ngủ',
    //           'Nhiều dầu. Tập trung ở mũi và trán',
    //           'Khô và nẻ',
    //           'Tấy đỏ Bong da'
    //         ]
    //       },
    //       {
    //         title:
    //           "Thực hiện rửa mặt với sữa rửa mặt của bạn với nước ấm. Từ 20 - 30' sau, cảm nhận của da bạn là thế nào?",
    //         answer: ['Tốt', 'Vẫn còn nhiều dầu', 'Khô và ráp', 'Mẫn đỏ']
    //       },
    //       { title: 'Hãy nhìn kỹ xem lỗ chân lông trên da bạn ra sao?', answer: ['Nhỏ', 'Lớn', 'Khô', 'Đỏ'] },
    //       {
    //         title: 'Từ nào dưới đây có thể miêu tả kết cấu da bạn?',
    //         answer: ['Mềm mịn', 'Nhiều dầu', 'Hơi khô', 'Mỏng, lộ đường mạch máu']
    //       },
    //       {
    //         title: 'Vào buổi trưa, da bạn ở trình trạng nào? (Không dùng tay, chỉ soi gương để đoán)',
    //         answer: ['Như buổi sáng', 'Sáng', 'Khô', 'Nhạy cảm']
    //       },
    //       {
    //         title: 'Bạn có thường xuyên nặn mụn trứng cá?',
    //         answer: ['Thỉnh thoảng', 'Thường xuyên, đặc biệt vào chu kỳ', 'Không bao giờ', 'Chỉ khi trang điểm']
    //       }
    //     ]
    //     const queryRunner: QueryRunner = this.dataSource.createQueryRunner()
    //     await queryRunner.connect()
    //     await queryRunner.startTransaction()
    //     try {
    //       for (const quiz of quizData) {
    //         // Insert quiz and get ID
    //         const newQuiz = await queryRunner.manager.save(Quiz, { title: quiz.title })
    //         // Insert choices with correct quiz ID
    //         const quizChoices = quiz.answer.map((answer) => ({
    //           choice: answer,
    //           quiz: newQuiz
    //         }))
    //         await queryRunner.manager.save(QuizChoice, quizChoices)
    //       }
    //       await queryRunner.commitTransaction()
    //       console.log('✅ Quiz data seeded successfully')
    //     } catch (error) {
    //       await queryRunner.rollbackTransaction()
    //       console.error('❌ Error seeding quiz data:', error)
    //     } finally {
    //       await queryRunner.release()
    //     }
    //   const skinTypes = [{ type: 'Da thường' }, { type: 'Da dầu' }, { type: 'Da khô' }, { type: 'Da nhạy cảm' }]
    //   for (const skinType of skinTypes) {
    //     const existing = await this.skinTypeRepository.findOne({ where: { type: skinType.type } })
    //     if (!existing) {
    //       await this.skinTypeRepository.save(this.skinTypeRepository.create(skinType))
    //     }
    //   }
    //   console.log('✅ SkinType seeding completed!')
  }
}
