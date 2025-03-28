import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { SkincareProductService } from './skincare-product.service'
import { CreateProductWithDetailsDto } from './dtos/AddProduct.dto'
import { UpdateProductDto } from './dtos/update-product.dto'

@Controller('skincare-product')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class SkincareProductController {
  constructor(private readonly SkincareProductService: SkincareProductService) {}

  @Get()
  async getAllProduct() {
    return this.SkincareProductService.getAllProduct()
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: number) {
    console.log(productId)
    return this.SkincareProductService.getProductById(productId)
  }

  @Put(':productId')
  async removeProduct(@Param('productId') productId: number) {
    return this.SkincareProductService.removeProduct(productId)
  }

  @Get('brand/:brandName')
  getProductByBrandName(@Param('brandName') brandName: string) {
    return this.SkincareProductService.getProductsByBrand(brandName)
  }

  @Get('search/byname')
  searchProductByName(@Query() query: any) {
    console.log(query)
    return this.SkincareProductService.searchProductByName(query.productname)
  }

  @Post('add-product')
  addNewProduct(@Body() productInfo: CreateProductWithDetailsDto) {
    return this.SkincareProductService.addProductToWarehouse(productInfo)
  }

  @Put('update/:id')
  updateProduct(@Param('id') productId: number, @Body() updateProductDto: UpdateProductDto) {
    return this.SkincareProductService.update(productId, updateProductDto)
  }

  @Get('sales/:productId')
  getProductSales(@Param('productId') productId: number) {
    return this.SkincareProductService.getProductSales(productId)
  }

  @Get('compare/:id1/:id2')
  compareProducts(@Param('id1') productId1: number, @Param('id2') productId2: number) {
    return this.SkincareProductService.compareProducts(productId1, productId2)
  }

  @Get('skin-type/:skinTypeId')
  async getProductsBySkinType(@Param('skinTypeId') skinTypeId: number) {
    return this.SkincareProductService.getProductsBySkinType(skinTypeId);
  }
}
