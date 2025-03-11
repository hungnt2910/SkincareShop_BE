import { Controller, Get } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
    constructor(private brandService : BrandService){}

    
    @Get()
    getAllBrand(){
        return this.brandService.getAllBrand()
    }
}
