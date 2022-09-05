import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ProductModel } from "./product.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { CreateProductDto } from "./dto/create-product.dto";
import { FindProductDto } from "./dto/find-product.dto";

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) { }

  create = async (dto: CreateProductDto) => this.productModel.create(dto);

  findById = async (id: string) => this.productModel.findById(id).exec();

  deleteById = async (id: string) => this.productModel.findByIdAndDelete(id).exec();

  updateById = async (id: string, dto: CreateProductDto) =>
    this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();

  async findProductsWithReviews(dto: FindProductDto) {
    return this.productModel.aggregate([
      {
        $match: {
          categories: dto.category
        }
      },
      {
        $sort: {
          _id: 1,
        }
      },
      {
        $limit: dto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
          reviewAvg: { $avg: '$reviews.rating' },
          reviews: {
            $function: {
              body: `function (reviews) {
								reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
								return reviews;
							}`,
              args: ['$reviews'],
              lang: 'js'
            }
          }
        }
      }
    ]).exec();
  }
}
