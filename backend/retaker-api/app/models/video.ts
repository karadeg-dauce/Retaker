import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id!: number;

  @column()
  public name!: string;

  @column()
  public url!: string;

  @column()
  public thumbnail_url!: string;

  @column()
  public description!: string;

  @column()
  public author!: string;

  @column()
  public fps!: number;

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime;
}
