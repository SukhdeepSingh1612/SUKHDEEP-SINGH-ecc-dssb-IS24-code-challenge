import { ApiProperty } from '@nestjs/swagger';


export class Product {
    @ApiProperty({ example: "A782ce7afkBZ" })
    productId?: string;

    @ApiProperty({ example: 'Product Name' })
    productName: string;

    @ApiProperty({ example: 'Name of Product Owner' })
    productOwnerName: string;

    @ApiProperty({ example: 'Developer list (Upto 5)' })
    Developers: string[];

    @ApiProperty({ example: 'Product Scrum Master' })
    scrumMasterName: string;

    @ApiProperty({ example: 'Start Date' })
    startDate: string;

    @ApiProperty({ example: 'Methodology (Agile or Waterfall)' })
    methodology: string;

    @ApiProperty({ example: 'Location (Github Repository)' })
    location: string;
}
