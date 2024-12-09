import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable(); // Nom de la vidéo
      table.string('url').notNullable(); // URL du fichier vidéo
      table.string('thumbnail_url').nullable(); // URL de la miniature
      table.text('description').nullable(); // Description de la vidéo
      table.string('author').nullable(); // Auteur
      table.integer('fps').nullable(); // Framerate de la video
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
