import { Product } from '../entities/product.entity';
import { customAlphabet } from "nanoid";
import * as fs from "fs";
import * as path from "path";
import { UpdateProductDto } from '../dto/update-product.dto';

let store: { data: Product[] } = { data: [] };

function syncToStorage() {
  fs.writeFileSync(path.join(__dirname, './mock.json'), JSON.stringify(store.data));
}

const generateUID = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz", 16);

function addData(data: Product) {
  data.productId = generateUID();
  store.data.push(data);
  
  syncToStorage();
  return data;
}

function deleteData(id: string) {
  store.data = store.data.filter(e=>e.productId!=id);

  syncToStorage();
}

function updateData(id: string, updateProductDto: UpdateProductDto) {
  const index = store.data.findIndex(e=>e.productId == id);
  
  if (updateProductDto.productName) {
    store.data[index].productName = updateProductDto.productName;
  }
  if (updateProductDto.productOwnerName) {
    store.data[index].productOwnerName = updateProductDto.productOwnerName;
  }
  if (updateProductDto.methodology) {
    store.data[index].methodology = updateProductDto.methodology;
  }
  if (updateProductDto.scrumMasterName) {
    store.data[index].scrumMasterName = updateProductDto.scrumMasterName;
  }
  if (updateProductDto.Developers) {
    store.data[index].Developers = updateProductDto.Developers;
  }
  if (updateProductDto.startDate) {
    store.data[index].startDate = updateProductDto.startDate;
  }
  if (updateProductDto.location) {
    store.data[index].location = updateProductDto.location;
  }

  syncToStorage();
  return store.data[index];
}

async function initStore() {
  await import("./data.json").then(data=>{
    for(const product of data) {
      addData({ ...product });
    }
  })
}

export default store;

export { initStore, addData, deleteData, updateData };
