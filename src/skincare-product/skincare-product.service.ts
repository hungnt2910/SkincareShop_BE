import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brand, Category, SkincareProduct, SkincareProductDetails, SkinType } from 'src/typeorm/entities'
import { Like, Repository, UpdateResult } from 'typeorm'
import { CreateProductWithDetailsDto } from './dtos/AddProduct.dto'
import { UpdateProductDto } from './dtos/update-product.dto'

@Injectable()
export class SkincareProductService {
  constructor(
    @InjectRepository(SkincareProduct)
    private readonly SkincareProductRepository: Repository<SkincareProduct>,
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly BrandRepository: Repository<Brand>,
    @InjectRepository(SkincareProductDetails)
    private readonly SkincareProductDetailsRepository: Repository<SkincareProductDetails>,
    @InjectRepository(SkinType)
    private readonly skinTypeRepository: Repository<SkinType>,
  ) {}

  async getAllProduct() {
    const products = await this.SkincareProductRepository.find({
      relations: ['category'] // Include category relation
    })

    return products.map((product) => ({
      ...product,
      categoryName: product.category?.name // Extract category name
    }))
  }

  async getProductById(productId: number) {

    const product = await this.SkincareProductRepository.findOne({
      where: { productId },
      relations: ["category", "brand", "orderDetails", "reviews"] // Include brand relation
    })

    if (!product) {
      throw new NotFoundException('Product is not found')
    }

    const relatedProducts = await this.SkincareProductRepository.find({
      where: { category: product?.category }
    })

    const productDetails = await this.SkincareProductDetailsRepository.find({
      where: { product: {productId: productId} },
    });

    return {
      ...product,
      brandName: product.brand?.brandName,
      categoryName: product.category?.name, // Extract brand name
      relatedProducts,
      productDetails
    }
  }

  async removeProduct(productId) {
    const result: UpdateResult = await this.SkincareProductRepository.update(productId, { isActive: false })

    if (result.affected === 0) {
      throw new NotFoundException('Product not found')
    }

    return await this.SkincareProductRepository.findOne({ where: { productId } })
  }

  async getProductsByBrand(brandName: string) {
    return await this.SkincareProductRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand') // Join with Brand table
      .where('brand.brandName = :brandName', { brandName }) // Filter by brand name
      .getMany()
  }

  async searchProductByName(productName: string) {
    console.log(productName)
    return await this.SkincareProductRepository.find({
      where: {
        productName: Like(`%${productName}%`)
      }
    })
  }

  async addProductToWarehouse(createProductDto: CreateProductWithDetailsDto) {
    const { categoryId, brandId, productionDate, expirationDate, quantity, ...productData } = createProductDto

    let product = await this.SkincareProductRepository.findOne({
      where: { productName: productData.productName }
    })

    if (!product) {
      // 🔹 Validate category
      const category = await this.CategoryRepository.findOne({ where: { categoryId } })
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`)
      }

      // 🔹 Validate brand
      const brand = await this.BrandRepository.findOne({ where: { brandId } })
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${brandId} not found`)
      }

      // 🔹 Create new product with `stock = quantity`
      product = this.SkincareProductRepository.create({ ...productData, category, brand, stock: quantity })
      product = await this.SkincareProductRepository.save(product)
    } else {
      // 🔹 If product exists, update its stock
      product.stock += quantity
      await this.SkincareProductRepository.save(product)
    }

    // 🔹 Add warehouse entry (Product Detail)
    const productDetail = this.SkincareProductDetailsRepository.create({
      productionDate,
      expirationDate,
      quantity,
      product // Link to product
    })

    return this.SkincareProductDetailsRepository.save(productDetail)
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.SkincareProductRepository.findOne({ where: { productId: id } })

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    Object.assign(product, updateProductDto)
    return this.SkincareProductRepository.save(product)
  }

  async getProductSales(productId: number) {
    const product = await this.SkincareProductRepository.findOne({ where: { productId } })

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`)
    }

    const result = await this.SkincareProductRepository.createQueryBuilder('product')
      .leftJoin('product.orderDetails', 'orderDetail')
      .select([
        'SUM(orderDetail.quantity) as totalQuantity',
        'SUM(orderDetail.price * orderDetail.quantity) as totalRevenue'
      ])
      .where('product.productId = :productId', { productId })
      .getRawOne()

    return {
      productId,
      productName: product.productName,
      totalQuantity: result?.totalQuantity || 0,
      totalRevenue: result?.totalRevenue || 0
    }
  }

  async compareProducts(productId1: number, productId2: number) {
    // 🔹 Retrieve both products
    const product1 = await this.SkincareProductRepository.findOne({
      where: { productId: productId1 },
      relations: ['category', 'brand', 'reviews']
    })

    const product2 = await this.SkincareProductRepository.findOne({
      where: { productId: productId2 },
      relations: ['category', 'brand', 'reviews']
    })

    if (!product1 || !product2) {
      throw new NotFoundException('One or both products not found')
    }

    // 🔹 Get sales data for both products
    const sales1 = await this.SkincareProductRepository.createQueryBuilder('product')
      .leftJoin('product.orderDetails', 'orderDetail')
      .select('SUM(orderDetail.quantity)', 'totalQuantity')
      .where('product.productId = :productId', { productId: productId1 })
      .getRawOne()

    const sales2 = await this.SkincareProductRepository.createQueryBuilder('product')
      .leftJoin('product.orderDetails', 'orderDetail')
      .select('SUM(orderDetail.quantity)', 'totalQuantity')
      .where('product.productId = :productId', { productId: productId2 })
      .getRawOne()

    // 🔹 Get average review ratings
    const averageRating1 = product1.reviews.length
      ? product1.reviews.reduce((sum, review) => sum + review.rating, 0) / product1.reviews.length
      : 0

    const averageRating2 = product2.reviews.length
      ? product2.reviews.reduce((sum, review) => sum + review.rating, 0) / product2.reviews.length
      : 0

    // 🔹 Format comparison data
    return {
      product1: {
        productId: product1.productId,
        productName: product1.productName,
        category: product1.category?.name,
        brand: product1.brand?.brandName,
        stock: product1.stock,
        price: product1.price,
        totalSold: sales1?.totalQuantity || 0,
        averageRating: averageRating1.toFixed(1),
        description: product1.description,
        urlImage: product1.urlImage
      },
      product2: {
        productId: product2.productId,
        productName: product2.productName,
        category: product2.category?.name,
        brand: product2.brand?.brandName,
        stock: product2.stock,
        price: product2.price,
        totalSold: sales2?.totalQuantity || 0,
        averageRating: averageRating2.toFixed(1),
        description: product2.description,
        urlImage: product2.urlImage
      }
    }
  }

  async getProductsBySkinType(skinTypeId: number): Promise<SkincareProduct[]> {
    return this.SkincareProductRepository
      .createQueryBuilder('product')
      .innerJoin('product.skinTypes', 'skinType')
      .where('skinType.skinTypeId = :skinTypeId', { skinTypeId })
      .getMany();
  }
}
