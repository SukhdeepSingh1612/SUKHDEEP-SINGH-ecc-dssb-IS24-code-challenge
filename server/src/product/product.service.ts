import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import store, { addData, updateData, deleteData } from './data/store';


@Injectable()
export class ProductService {
  
  create(createProductDto: CreateProductDto) {
    return addData(createProductDto);
  }

  
  findAll() {
    return store.data;
  }

  
  findOne(id: string) {
    const product = store.data.find((e) => e.productId === id);

    if(product) {
      return product;
    } else {
      throw new NotFoundException(`Product ID specified does not exist.`);
    }
  }

  
  update(id: string, updateProductDto: UpdateProductDto) {
    this.findOne(id); 

    return updateData(id, updateProductDto);
  }

  
  remove(id: string) {
    this.findOne(id); 
    
    deleteData(id);
    
    return null;
  }
}
