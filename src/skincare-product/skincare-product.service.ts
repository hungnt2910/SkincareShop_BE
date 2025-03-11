import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brand, Category, SkincareProduct, SkincareProductDetails } from 'src/typeorm/entities'
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
  ) {}

  async getAllProduct() {
    return this.SkincareProductRepository.find()
  }

  async getProductById(productId : number) {
    console.log(productId)
    const product = await this.SkincareProductRepository.findOne({
      where: { productId },
      relations: ["category"], 
    })

    console.log(product)
    if(!product){
      throw new NotFoundException("Product is not found")
    }
    const relateProduct = await this.SkincareProductRepository.find({ where: { category: product?.category } })
    return { ...product, relatedProduct: relateProduct }
  }

  async removeProduct(productId) {
    const result: UpdateResult = await this.SkincareProductRepository.update(productId, { isActive: false })

    if (result.affected === 0) {
      throw new NotFoundException('Product not found')
    }

    return await this.SkincareProductRepository.findOne({ where: { productId } })
  }

  async getProductsByBrand(brandName: string) {
    return await this.SkincareProductRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand') // Join with Brand table
      .where('brand.brandName = :brandName', { brandName }) // Filter by brand name
      .getMany();
  }

  async searchProductByName(productName : string){
    console.log(productName)
    return await this.SkincareProductRepository.find({
      where: {
        productName: Like(`%${productName}%`)
      }
    })
  }

  async addProductToWarehouse(createProductDto: CreateProductWithDetailsDto) {
    const { categoryId, brandId, productionDate, expirationDate, quantity, ...productData } = createProductDto;
  
    let product = await this.SkincareProductRepository.findOne({
      where: { productName: productData.productName },
    });
  
    if (!product) {
      // 🔹 Validate category
      const category = await this.CategoryRepository.findOne({ where: { categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
  
      // 🔹 Validate brand
      const brand = await this.BrandRepository.findOne({ where: { brandId } });
      if (!brand) {
        throw new NotFoundException(`Brand with ID ${brandId} not found`);
      }
  
      // 🔹 Create new product with `stock = quantity`
      product = this.SkincareProductRepository.create({ ...productData, category, brand, stock: quantity });
      product = await this.SkincareProductRepository.save(product);
    } else {
      // 🔹 If product exists, update its stock
      product.stock += quantity;
      await this.SkincareProductRepository.save(product);
    }
  
    // 🔹 Add warehouse entry (Product Detail)
    const productDetail = this.SkincareProductDetailsRepository.create({
      productionDate,
      expirationDate,
      quantity,
      product, // Link to product
    });
  
    return this.SkincareProductDetailsRepository.save(productDetail);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.SkincareProductRepository.findOne({ where: { productId: id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    return this.SkincareProductRepository.save(product);
  }
}
