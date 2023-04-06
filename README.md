<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# DOCKER

Crear una imagen de postgresql con el `docker-compose.yaml`

```
version: '3'


services:
  db:
    image: postgres:14.3
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: teslodb
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

Crearse un `.env`, usar el `.env.template`

```
DB_PASSWORD=MySecr3tPassWord@as2
DB_NAME=TesloDB
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
```

Levantar la imagen:

```
docker-compose up -d
```

## Usar variables de entorno

Instalar

```
npm i @nestjs/config
```

Ir a `app.module.ts` importar

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
```

Con esta configuracion ya podemos usar variables de entorno.

## Usar TypeOrm

Instalar

```
npm i @nestjs/typeorm typeorm
```

y en el `app.module.ts` hay q importarlo

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

```

El `synchronize` se usa en false cuando estemos en produccion y los cambios en la abse de datos se hace mediante migraciones.

Con esta configuracion ya podemos usar la base de datos postgres.

## TypeORM - Entity - Product

Generar un nuevo recurso de CRUD:

```
 nest g res products --no-spec

? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
CREATE src/products/products.controller.ts (957 bytes)
CREATE src/products/products.module.ts (268 bytes)
CREATE src/products/products.service.ts (651 bytes)
CREATE src/products/dto/create-product.dto.ts (33 bytes)
CREATE src/products/dto/update-product.dto.ts (181 bytes)
CREATE src/products/entities/product.entity.ts (24 bytes)
UPDATE package.json (1980 bytes)
UPDATE src/app.module.ts (644 bytes)
✔ Packages installed successfully.
```

Definir el Entitity que es una representacion del objeto en la base de datos(seria una tabla).

```
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;
}
```

Para hacer la conexion del entity con la base de datos tenemos que ademas de definirla hacer una importacion en el modulo.

```
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product]),
  ]
})
export class ProductsModule { }
```

Con esta configuracion esta sincornizada el entity y la base de datos.

## Agregar el prefijo al endpoint

Ir al `main.ts` y agregar con el metodo `.setGlobalPrefix()` el path `api/`

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();

```

## Configurar DTO para validar la entrada de datos

Instalar

```
npm i class-validator class-transformer
```

Para poder usar las validaciones en los DTOs.
Para usar las validaciones de forma global hay que configurar en el main.ts

```
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
```

El whitelist solo toma los valores declarados en el DTO y el forbidNonWhitelisted da un error cuando se envia mas datos de los esperados.

Podemos crear el DTO:

```
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
}
```

Con las instalaciones podemos usar los decoradores.

## Insertar Usando TypeORM

En vez de usar el `new Producto()` tenemos que isar el patron repositorio que es indicado para hacer las inserciones a la base de datos.

Que es el patron repositorio?

```
El patrón repositorio consiste en separar la lógica que recupera los datos y los asigna a un modelo de entidad de la lógica de negocios que actúa sobre el modelo, esto permite que la lógica de negocios sea independiente del tipo de dato que comprende la capa de origen de datos, en pocas palabras un repositorio media entre el dominio y las capas de mapeo de datos, actuando como una colección de objetos de dominio en memoria (M. Fowler), ahora bien, ¿qué es el patrón unidad de trabajo?
Este centraliza las conexiones a la base de datos realizando un seguimiento de todo lo que sucede durante una transacción cuando se usan capas de datos y revertirá la transacción si Commit() no se ha invocado o existen incongruencias lógicas.
```

Primero hay que inyectar el repositorio en el servicio para poder hacer las inserciones y las queries.

```
/product.service.ts

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }
  ................
}
```

En el `@InjectRepository(Product)` insertamos el entity `Producot` y en el tipo del `Repository<Product>` tambien insertamos el product de esta forma tenemos los metodos para poder realizar consultas e inserciones en al base de datos.
Crear el producto:

```
  async create(createProductDto: CreateProductDto) {

    try {
      // crear el producto(3 formas), no lo graba en la base de datos
      const product = this.productRepository.create(createProductDto);
      // guardar en base de datos
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda');
    }

  }
```

## Manejo de Errores

Trataremos de hacer la menor cantidad de consultas a la base de datos. Para eso podemos usar el mismo `error` para poder dar un mensake acorde.

### Mostar errores de la forma de nest

Tenemos que crear una propiedad privada de logger desde el servicio.

```
import { Logger } from '@nestjs/common';

private readonly logger = new Logger('ProductsService');
```

Y luego usamos el `logger` como un console.log para mostrar el error en consola

```
this.logger.error(error);
```

y le mandamos el error del `try/catch`, Nest hace todo el formateo del mensaje.
Ahora podemos crear una funcion a la cual le podemos agregar mas excepciones:

```
  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    // console.log(error)
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
```

Y usar en try/catch en la parte del error.

## BeforeInsert y BeforeUpdate

Estos decoradores se usan en el Entity. Y son transformaciones que suceden cuando la data pasa por el.

```
/entities/product.entity.ts

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
```

## Get y Delete con TypeORM

Para poder verificar que los id son de tipo `UUID` podemos usar en el controllador que verifique con el pipe `ParseUUIDPipe`, de la siguiente forma:

```
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

```

Ahora en el servicio podemos manejar la logica sabiendo que sino envia un `UUID` el pipe lo interceptara y lanzara un error.

```
  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product with id not found');
    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return;
  }
```

## Paginar en TypeORM

#### Creamos el modulo common

Creamos un nuevo modulo donde estara el pagination dto porque es una propiedad que puede ser usada en diferntes endpoints.

```
nest g mo common
```

Dentro de esta carpeta creamos los dtos.

#### DTO Pagination

Crear otro DTO en un modulo `common`:

```
/common/dtos/pagination.dto.ts

import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //enableImplicitConvertions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //enableImplicitConvertions: true
    offset?: number;
}
```

Con este DTO especificamos las propiedades que necsitamos para el pagination que son el `limit` y el `offset`.
Aca tambien hacemos la conversion a numero del query.

#### Query

Tenemos que verificar que por `@Query()` nos envien las propiedeades que necesitamos para la paginacion.

```
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
```

#### Modificar el getAll del servicio

Modificamos el getAll() para que pueda usar las propiedades de la paginacion y si no viene ponemos valores por default.

```
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
    });
    return products;
  }
```

El `find` acepta objetos con las propiedeades que necesitamos que son el `take` y el `skip`, que son los valores de la paginacion.

## Buscar por slug o uuid

Instalar uuid:

```
npm i uuid
npm i --save-dev @types/uuid
```

Primero validamos con la funcion validate de uuid

```
import {validate as isUUID} from 'uuid';

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
  }
```

Se puede ver que en la funcion findOne tenemos una validacion de que el term es UUID y sino se busca por slug

## QueryBuilder

Para hacer consultas mas complejas usamos la funcion para crear querys.

```
  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {

  --> const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).getOne();

    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
  }
```

Para cambiar de mayus a minusc o viceversa en postgres tenemos los metodos UPPER() y LOWER().
La funcion createQueryBuilder nos permite utilizar metodos de SQL para manejar las busquedas por eso acepta el `OR`; y el `=:` indica que los valores que siguen vienen del objeto que entra como segundo parametro en la funcion.

## Update en TypeORM

Para el update ponemos la validacion de ParseUUIDPipe en el path del controlador, y luego en el servicio realizamos el update.

```
  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });
    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

    try {

      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBException(error);
    }
  }
```

Con `this.productRepository.preload()` buscamos por el id y luego sobreescribimos las propiedades con el destructuring del `updateProductDto`, este procedimiento solo prepara la informacion, luego hay que guardarlos con la funcions `save()` y pasarle el objeto product. En el controlador podemos retorna si el await ya que se resuleven las promesas, pero es mejor estar seguros.

## BeforeUpdate

Ya que tenemos el `slug` obligatorio podemos hacer la transformacion en el Entity:

```
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
```

## Nueva Columna - tags

Para agregar una nueva columna a nuestra base de datos, tenemos que declararla en el entities, y tambien en el dto para que acepte el nuevo valor.

```
/entities/product.entity.ts

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

```

```
/dto/create-product.dto.ts

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];
```

De esta forma estamos creando con el entity la nueva columna en la base de datos y con el dto estamos aceptando el nuevo valor como entrada.
`@IsOptional()` porque ya tenemos un valor por defecto que es [] , ose el array vacio.

# ProductImage Entity

Creamos una nueva entity en el mismo modulo de product, para las imagenes.

```
/entities/product-image.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;
}
```

Y lo conectamos a la base de datos para que genere la nueva tabla.

```
/app.module.ts

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),  <--
  ]
})
export class ProductsModule { }
```

Lo declaramos en el `TypeOrmModule.forFeature([])` en el array, y de esta manera se genera la tabla.

## OneToMany y ManyToOne

Para definir la relacion entre las dos tablas tenemos que crearla con los decoradores de typeORM en una `@OneToMany` y en la otra ` @ManyToOne`, de esta forma se crea el vinculo.

```
/product.entity.ts

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true }
    )
    images?: ProductImage[];
```

```
/product-image.entity.ts

    @ManyToOne(
        () => Product,
        (product) => product.images,
    )
    product: Product
```

En el product.entity.ts agregamos la relacion de `@OneToMany()`, este acepta 2-3 argumentos, el primero indica qel tipo de objecto el cual estamos esperando que es `ProductImage` o `Product`, el segundo como se va a relacionar la otra tabla con esta tabla y el tercero son las configuraciones, en este caso `cascada: true` indica que si eliminamos o modificamos el producto tambien lo hace la relacion.

## Crear Imagenes de producto

En el dto de `create-product.dto.ts` tenemos que agregar la propiedad images:

```
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
```

Luego en el servicio al metodo de crear producto le agregamos la creacion de imagenes:

```
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      // crear el producto(3 formas), no lo graba en la base de datos
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      // guardar en base de datos
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {

      this.handleDBException(error);

    }
  }
```

Si las imagenes no vienen se pone un array vacio, y tampoco en el momento de crear hay que especificar el id del producto ya que TypeORM lo infiere al estar creado dentro del producto, el cual luego se graba.

# Aplanar las imagenes

Si estamos usando algun query con `find*` entonces podemos habilitar en el entity la opcion `eager: true`, que nos envia los dato de la relacion.

```
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];
```

Y si estamos usando el queryBuilder tenemos que usar el ` .leftJoinAndSelect('prod.images', 'prodImages')` este metodo nos pide dos o tres argumentos que son la propiedad de la relacion, el alias de la tabla y las opciones. cuando usamos el `createQueryBuilder('prod')` estamos dando el alias a la tabla.

```
  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return product;
  }
```

## Query Runner

Para hacer una actualizacion necesitamos borrar las anteriores imagenes y luego hacer la actualizacion.
El queryRunner nos permite hacer rollback si algo sucede mal de esa forma no perderiamos la data.
Para usar el queryRunner debemos inyectar en el servicio:

```
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource, <--
  ) { }
```

Y luego en la funcion update instanciamos:

```
 async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository
      .preload({ id, ...toUpdate });

    if (!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }
```

## Eliminacion en cascada

Se puede borrar primero las imagenes y luego el producto, eso seria una solucion.
En la entity podemos especificar que hacer cuando eliminan al producto:

```
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
```

Con el `onDelete` en `CASCADE` se elimina las imagenes que estan relacionadas al producto.

## Product Seed

Generar un nuevo resource

```
nest g res seed --no-spec
```

En el modulo de producto exportamos el servicio, asi en el modulo de servicio lo importamos y lo podemos inyectar.

```
/products.module.ts

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule { }
```

Tambien es comun exportar el TypeOrmModule para poder usar los repositorios.
Para usarlo en el nuevo recurso necesitamos importalo en el modulo.

```
/seed.module.ts

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule]
})
export class SeedModule { }
```

Con esto ya podemos inyectarlo en nuestro servicio.

## Carga de archivos de forma masiva

```
import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private productsService: ProductsService
  ) { }


  async runSeed() {
    await this.insertNewProducts();

    return `Seed execute`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productsService.create(product));
    })
    await Promise.all(insertPromises);

    return true
  }
}

```

Creamos un array con las promesas y luego realizamos un `Promise.all` para ejecutarlas.

# .gitkeep

Es un archivo que no pesa casi nada y se utiliza para indicar a `git` que suba la carpeta que lo contiene.

# Subir archivos con Nest

La carga de archivos es algo general que solo cambia algunas propiedades.
Crear un modulo `files` donde estar el metodo para subir archivos.
Se recomienda no alpjar las imagenes en el mismo servidor donde esta la data o donde se manejan los datos. Es mejor usar servicio de terceros como un buccket de AWS o Cloudinary para alojar imagenes.

```
nest g res files --no-spec
```

La configuracion que pide nest es instalar el tipo `multer`:

```
npm i -D @types/multer
```

Con esta instalacion podemos realizar el tipado del archivo.

```
/files/files.controller.ts

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
```

El interceptos nos permite tomar el tipo que elegimos.
Con esto ya estamos manejando el archivos desde el back y solo faltaria guardarlo con filesystem.

## Validar archivos

Nos creamos una funcion helper para validar el archivo:

```
export const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: Function) => {

    // console.log(file)
    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions =['jpg', 'jpeg', 'png' , 'gif'];
    if(validExtensions.includes(fileExtension)){
        return callback(null,true)
    }
    callback(null, false);

}
```

Si el callback devuelte false, nest lanza un error.
Si el callback es true entonces deja pasar el archivo.
Esta funcion la usamos en el interceptor del controlador.

```
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter   <--- Aca usamos la funcion
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if(!file){
      throw new BadRequestException('Make sure that file is an image.')
    }
    return {
      fileName: file.originalname
    };
  }
```

Si el interceptor no devuelve nada entonces lanzamos un `BadRequestException`.

## Guardar Imagen en FileSystem

No se guarda en carpeta `public` porque esta disponible para cualquier usuario este autenticado o no.
Crearse otra carpeta `static` o `uploads`, para indicar que se guarden en estos `paths` tenemos que enviar la siguiente configuracion:

```
@Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits:{fieldSize:1000}
    storage: diskStorage({
      destination:'./static/uploads'
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image.')
    }
    return {
      fileName: file.originalname
    };
  }
```

En el `storage` definimos con el `diskStorage` el `destination` que es el `path` de la carpeta en donde queremos guardar los archivos.

## Renombrar el archivo subido

```
@Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits:{fieldSize:1000}
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image.')
    }
    return {
      fileName: file.originalname
    };
  }
```

Para renombrar un archivo debemos usar la propiedad `filename` del `diskStorage` esta espera 3 argumentos, y para ello nos creamos una funcion helper:

```
import { v4 as uuid } from "uuid";


export const fileNamer = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: Function) => {

    // console.log(file)
    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`
    callback(null, fileName);

}
```

Para este momento ya tenemos el archivos pero igual dejamos la validacion por si acaso, luego creamos el `fileName` y los devolvemos en el `callback`.

## Servir archivos de manera controlada

En el service nos creamos un metodo que devuelva el path de la imagen.

```
import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    getStaticProductImage(imageName: string) {
        const path = join(__dirname, '../../static/products', imageName);

        if (!existsSync(path)) {
            throw new BadRequestException(`No product found with image ${imageName}`)
        }

        return path;
    }
}
```

El `path` lo creamos con el metodo `join` el cual necesita la direccion local, y el nombre de la imangen. Sino exsite devolvemos un `BadRequestException`.
Ahora lo usamos en el controlador:

```
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);

    return res.sendFile(path);

  }
```

Cuando usamos el decorador @Res() estamos indicanod a `NEST` que ahora nosotros estamos controlando de manera manual todo la respuesta con `Express`, por eso al final usamos el `res.sendFile()` para servir la imagen.

## Retornar el secureUrl

La idea es que el path sea con una variable de entorno.
Para usar variables de entorno tenemos que inyectar el `ConfigService`:

```
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }
```

Tambien importamos en el modulo

```
@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule]
})
```

Lo usamos en el controlador:

```
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits:{fieldSize:1000}
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is an image.')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return {
      secureUrl
    };
  }
```

## Otras formas de desplegar archivos

Para servir archivos de manera estatica tenemos que instalar:

```
npm i @nestjs/serve-static
```

y luego configurar en el app.module.ts:

```
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

```

Con esta configuracion tenemos que estar seguros que lo queremos mostrar son estos archivos ya que es publico visible para cualquier persona.

# Auntenticacion y Autorizacion

## Entidad de Usuario

Crear resource `auth`:

```
 nest g res auth --no-spec
```

La entidad relaciona la tabla de datos con nuestra esta.
Para generar la tabla debemos importar el `TypeOrmModule.forRoot` y si queremos usar la entidad en otros modulos solamente exportamos el `TypeOrmModule`.

```
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule]
})
export class AuthModule { }
```

Para generar las columnas hay que declararlas con el decorador en el entity.

```
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];
}
```

Se acostumbra a usar identificadores unicos que no cambien.

## Crear Usuario

Crear un endpoint para crear el usuario. Mediante una peticio `Post`.
Para eso en el controlador creamos la ruta con el dto:

```
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
```

Luego en el servicio inyectamos la entity `User` para poder usar los metodos de la tabla:

```
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }
```

Creamos el dto para validar la data que necesitamos:

```
export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    fullName: string;
}
```

Creamos la funcion que genera el usuario:

```
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
```

Y un manejador de excepciones:

```
  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }
```

## Encriptar la contraseña

No debemos devolver las contraseñas y tampoco se deben almacenar de manera plana sino encriptada.
Para eso usamos hash de encriptacion de una sola via, para eso instalamos:

```
npm i bcrypt
```

Y usamos el metodo de hashSync indicandole la contraseña y las vueltas en numeros enteros.

```
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
```

Podemos ver que estamos encryptando la contraseña `password: bcrypt.hashSync(password, 10)` y luego hacemos un delete `delete user.password;`, esto es para no devolver en el json.

## Login de Usuario

Creamos una peticion post para el login:

```
  @Post('login')
  loginUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.login();
  }
```

Para dejar de enviar el password en cada consulta podemos usar el select en la entity en false, esto desabilita enviar esta columna:

```
    @Column('text', {
        select: false
    })
    password: string;
```

Solo necesitamos el password y la contraseña. Para eso creamos un nuevo deto `login-user.dto.ts`:

```
  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true }
      });
      if (!user) {
        throw new UnauthorizedException('Credentials are not valid(email)');
      }
      if (bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid(password)')
      }
      return user;
    } catch (error) {
      this.handleDBErrors(error)
    }
  }
```

Este metodo `bcrypt.compareSync(password, user.password)` intenta comparar el usuario que nos envia con el de la base de datos y si son similares retorna un boleano.
Para este endopoint nose creamos un nuevo dto el `login-user.dto.ts`:

```
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}
```

Con esto estamos pidiendo que la data que nos envien es obligatoria, es diferentes si extendemos de createUserDto porque serian opcionales.

## Nest Authentication - Passport

JWT es un string que esta firmado y nos permite saber si esta autentificado.
Passport nos permite usar diferentes estrategias como usar de manera local o mediante JWT.
Para instalarlos tenemos que hacer :

```
npm i --save @nestjs/passport passport
npm i --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

### Usar en modo sincrono:

Para ello tenemos que ir al modulo de auth y poner la siguien configuracion:

```
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn:'2h'
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class AuthModule { }
```

De esta forma en `secret` ponemos nuestra llave para firmar los tokens, y en `signOptions` podemos poner la duracion o validez que tendra el token.
El modo sincrono no se usar mucho es mejor optar por el modo asincrono.

### Modulos asincronos

Se usa el `useFactory` para registrar de manera asincrona el modulo. Y debe retornar las opciones o configuracion del JWT.
Se usa `ConfigService` porque da mas opciones que las variables de entorno, como poder realizar procesos, verificar datos, cambiar, etc.

```
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class AuthModule { }
```

## JWT Strategy

Una vez configurado el token, se tiene que usar para esto creamos una funcion que valide el usuario mediante el JWT.

```
/strategies/jwt.strategy.ts

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userRepository.findOneBy({ email })
        if (!user) throw new UnauthorizedException('Token no valid')
        if (!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin')
        return user;
    }
}
```

Tambien creamos una interface que no ayuda a saber que elemento esperamos que reciba en este caso un objeto con el valor email.
Esta funcion va a ejecutarse cuando pase al menos dos validaciones:

- Token no haya expirado
- La firma sea la correcta
  Las Estrategias son providers y tienen que conectarse en algun lado, para ello se inyecta como provider en el modulo y para usarlo en otro lado se exporta.
  Para ellos hacemos en el modulo:

```
/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn:'2h'
    //   }
    // })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
```

## Generar JWT

Para generar debemos usar el servicio de `JwtService`, y en el servicio que queremos generar lo inyectamos, luego nos creamos una funcion generadora de token:

```
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }

    private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
```

En la entidad podemos ejecutar una funcion para poner en minuscula el email:

```
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
```

## Private Route - General

Para tener una ruta controlada debemos usar el `@UseGuards(AuthGuard())` este guard usa la funcion que creamos en la estrategia y cuando pasa por esta verifica si el usuario esta activo o o no.

```
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute() {
    return {
      ok: true,
      message: 'Hola mundo private'
    }
  }
```

## Nombrar strategy

Podemos nombrar las estrategias y usarlas en el `AuthGuard()`:

```
export class JwtStrategy extends PassportStrategy(Strategy, 'myjwt')
```

De esta forma podemos tener varias e ir activandolas.

## Custom Property Decorator - GetUser

Para generar decoradores podemos usar el CLI con el comando:

```
nest g decorator
```

Esto genera un decorador global, funciona por clase y por ruta de controlador, pero no por propiedad.

Para obtener los datos del `Guard` podemos hacer uso del un decorador personalizado:

```
/auth/decorators/get-user.decorator.ts

import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContextHost) => {
        // console.log({ data })
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) throw new InternalServerErrorException('User not found in request')

        return user;
    }
);
```

Y en el controlador lo usamos para obtener el usuario:

```
/auth/auth.controller.ts

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }
```

Dentro de `@GetUser()` podemos enviar parametros que vendria a ser la data del decorador.

## Custom Guard

Para crear un `guard` podemos generarlo mediante el cli de nest:

```
nest g gu auth/guards/userRole --no-spec
```

Este `guard` resueleve a un boleanos, iuna promesa que resuelve un boleano o un observable de rxjs que emita un boleano.

```
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard')
    return true;
  }
}
```

Para usarlo debemos llamarlo en el controlador con el `@UseGuard()` se recomienda no instanciarlo porque queremos que use siempre la misma instancia.

```
  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)  <--
  privateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user
    }
  }
```

De esta manera pasa por el `guard`. La excepcion es controlada por Nest, ya que esta se encuentra en la zona donde nest controla la excepciones.

### Obtener los datos de la metadata

Para obtener la metadata debemos usar:

```
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard');

    const validRoles: string[] = this.reflector.get('roles', context.getHandler())

    console.log({ validRoles })

    return true;
  }
}
```

Usamos el `Reflector` para obtener la metadata y asi en este caso obtener los `validRoles`'.

## Verficar Rol del Usuario

```
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get('roles', context.getHandler())
    if (!validRoles) return true
    if (validRoles.length === 0) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }
    throw new ForbiddenException(`User ${user.fullName} need a valid role:[ ${validRoles}]`)
  }
}
```

En el `guard` podemos verificar que el usuario tenga un rol que se encuentra en la metadata, si esta no existe o no tiene elementos entonces se permite pasar. Si algun role conincide con el usuario tambien retorna true y se deja pasar.

## Custom Decorator - Roleprotected

Crearse un decorador con el cli:

```
nest g d auth/decorators/roleProtected
```

Creamos una constante `META_DATA` a la cual le asignamos el valor de los roles y creamos un `enum` para asignar los valores validos que puede recibir.

```
auth/decorator/role-protected.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
    return SetMetadata(META_ROLES, args);
}
```

Creamos un enum en interfaces

```
auth/interfaces/valid-roles.ts

export enum ValidRoles {
    admin = 'admin',
    superUser = 'super-user',
    user = 'user'
}
```

Tambien cambiamos el valor de donde obtenemos los roles por el de `META_DATA`:

```
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
```

En el controlador aplicamos este nuevo decorador:

```
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user
    }
  }
```

Inyectamos el decorador y le enviamos los valores que acepta del enum.

## Composicion de decoradores

Para agrupar todo en un solo decorador creamos:

```
auth/decorators/auth.decorator.ts

import { UseGuards, applyDecorators } from "@nestjs/common";
import { ValidRoles } from "../interfaces/valid-roles";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role.guard";

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
    )
}
```

Y lo aplicamos en el controlador:

```
  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  privateRoute3(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user
    }
  }
```

Y le enviamos lo valor que necesita vereficarse.

## Auth en otros modulos

Para usar passport en otros modulos debemos `exportar` el JwtStrategy y el PassportModule del modulos auth.
Para usar el decorador simplemente lo importamos y los usamos, pero en el modulo tambien importamos el AuthModule en este caso.

## User que creo el product

Para saber que usuario creo el producto tenemos que crear la relacion de `OneToMany` y `ManyToOne` entre `user` y `product`:
En user:

```
    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;
```

En product:

```
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;
```

Como vemos la primera parte indica con que tabla se quiere relacionar y la segunda indica como se relacion la propiedad con la otra de la tabla.
Con el eager en true hacemos que la consulta cargue los datos del usuario cuando se llama al producto.

## Insertar userId en los productos

En el controlador usamos el decorador para obtener al usuario

```
  @Post()
  @Auth()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user);
  }
```

Luego en el servicio creamos la relacion, enviando el user en el create:

```
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user
      });
```

Y en el update antes de guardarlo podemos especificar la relacion:

```
      product.user = user;
      await queryRunner.manager.save(product);
```

## Seed de usuarios, productos, e imagenes

Tenemos que crear la base de datos de los usuarios:

```
    users: [
        {
            email: 'test1@gmail.com',
            fullName: 'eric denis',
            password: '12345tres',
            role: ['admin']
        },
        {
            email: 'test2@gmail.com',
            fullName: 'lizeth gutierrez',
            password: '12345tres',
            role: ['user', 'super']
        },
    ],
```

Con su interface.
Luego hay que insertarlos en la tabla de usuarios, pero antes hay que borrar toda la tabla, para ello hay que hacerlo en orden para que no de errores de relacion por las `foreign keys`.
Nos creamos una funcions en el servicio para borrar las tablas:

```
  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }
```

Y ahora podemos crear una funcion que guarde los usuarios y retorne un usuario para poder hacer la relacion con los productos.

```
  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    });
    const dbUser = await this.userRepository.save(seedUsers)
    return dbUser[0]
  }
```

Luego mandamos el resultado de esta funcion para que cree la relacion con los productos.
Podemos ver que tenemos que usar los usuarios que ya se guardaron porque tiene el id que es un requerimiento necesario.

## 25 - Encriptar contraseña de usuarios del Seed

Para ello tenemos que usar el bcrypt en la contraseña del seed:

```
import * as bcrypt from 'bcrypt';
    users: [
        {
            email: 'test1@gmail.com',
            fullName: 'eric denis',
            password: bcrypt.hashSync('12345tres', 10),
            role: ['admin']
        },
        {
            email: 'test2@gmail.com',
            fullName: 'lizeth gutierrez',
            password: bcrypt.hashSync('12345tres', 10),
            role: ['user', 'super']
        },
    ],
```

## 26 - Check AuthStatus

Para chequera el status podemos crear una nueva ruta para generar otro token:

1. Creamos la nueva ruta:

```
  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus(user);
  }
```

@. Creamos en el servicio la funcione generadora:

```
  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }
```

# Documentacion - OpenAPI

Instalar swagger:

```
npm install --save @nestjs/swagger
```

Tenemos que hacer la configuracion basica en el `main.ts` poniendo:

```
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```

Antes del `app.listen` los labels los escribimos despues.
Esta `docuemntacion` se habilita en el endpoin `api` como lo indica el ` SwaggerModule.setup`

## Tags, ApiProperty y ApiResponse

Para agregar tags podemos usar el decorador `@ApiTags()` en el controlador del endpoint.

```
@ApiTags('Products')   <---
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
............
}
```

Tambien tiene diferentes opciones para ordenarlo.
Si queremos mostrar el tipo de respuesta que da el endpoint usamos `@ApiResponse()` el cual damos un objeto con las propiedades.

```
  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Product was created', type:Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token relate' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user);
  }
```

Para indicar la repuesta tenemos que definirlo en la etiqueta `@ApiResponse()` como el `type` y pasarlo la entidad de la tabla y luego en ella definimos las propiedades con `@ApiProperty()`:

```

@Entity({ name: 'products' })
export class Product {
    @ApiProperty()    <--
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()    <--
    @Column('text', {
        unique: true,
    })

    title: string;
    @ApiProperty()    <--
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty()    <--
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;
    ............
    .......
}
```

## Documentar DTO

Podemos documentar los DTOS para saber como se ve la data con el `@ApiProperty`.

```
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title(unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
.....
....
}
```

Y en el update simplemente cambiamos el import `PartialType` a `@nestjs/swagger`

```
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

```

# Websocket Gateways

Instalar:

```
npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

Para ello usamos el Websocket y el gateway lo usamos como si fuera un controlador.

```
nest g res messagesWs --no-spec
? What transport layer do you use? WebSockets
? Would you like to generate CRUD entry points? No
CREATE src/messages-ws/messages-ws.gateway.ts (242 bytes)
CREATE src/messages-ws/messages-ws.module.ts (258 bytes)
CREATE src/messages-ws/messages-ws.service.ts (94 bytes)
UPDATE src/app.module.ts (1189 bytes)
```

Podemos crear el resource y elegimos la opcion de websocket, se puede crear todo un crud pero por lo general solo se usa de manera muy especifica.

## Server - Escichar conexiones y desconecciones

El gateway tiene una sala por defecto que es el root.
Podemos crear diferentes salas con el `namespace` y cada usuario que entre accede con un nombre o identificador que es unico.
Para saber cuando se conecgta o desconecta un usuario tenemos que implementar dos interfaces:

```
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly messagesWsService: MessagesWsService

  ) { }
  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id)
  }
  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id)
  }

}
```

Para tener las propiedades de socket debemos instalar:

```
npm i socket.io
```

## Mantener identificados a los clientes

Primero hay que hacer la conexion con el front de la aplicacion, para ello instalamos:

```
npm i socket.io-client
```

y en el client creamos una funcion para realizar la conexion:

```
import { Manager } from "socket.io-client"

export const connectToServer = () => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

    const socket = manager.socket('/');
}
```

Una vez conectada, en el servicio del back podemos crear dos funcions una para registrar a los clientes y otra para eliminarlos. Ademas de un contador de clientes conectados.

```
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}

    registerClient(client: Socket) {
        this.connectedClients[client.id] = client;
    }
    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }

    getConnectedClients(): number {
        return Object.keys(this.connectedClients).length;
    }
}
```

Ahora los usamos en el gateway:

```
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);

    console.log({ conectados: this.messagesWsService.getConnectedClients() })
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
  }
}
```

## Cliente - Detectar conexion y desconexion

Para detectar la conexion podemos usar el `socket.on` que nos permite escuchar el servidor, si queremos emitir algun mensaje usarmos el `socket.emite`.

```
const addListeners = (socket: Socket) => {
    const serverStatusLabel = document.querySelector('#server-status');
    // escuchar el estado de la conexion
    socket.on('connect', () => {
        console.log('connected');
        serverStatusLabel!.innerHTML = 'connected'
    })
    // si se cae la conexion
    socket.on('disconnect', () => {
        console.log('disconnected');
        serverStatusLabel!.innerHTML = 'disconnected'
    })
}
```

## Cliente - Clientes conectados

Para obtener info del server de manera total usamos un decorador que nos permite acceder a la info y poder usarla.

```
@WebSocketServer() wss: Server;
```

Ahora con `wss` podemos usarla en las funciones y emitir info al cliente

```
@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

}
```

Y desde el cliente podemos escuchar esta info y asi poderla imprimir:

```
 // escuchamos el servidor con los id de los clientes
    socket.on('clients-updated', (clients: string[]) => {
        // console.log({ clients })
        let clientHtml = '';
        clients.forEach(clientId => {
            clientHtml = `
                <li>${clientId}</li>
            `
        });
        clientUl!.innerHTML = clientHtml
    })
```
## Formas de emitir desde el servidor
Para que solo los mensajes le lleguen al cliente inicial podemos enviar:
```
  // Escuchar los eventos que suceden en el cliente

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // Emite unicamente al cliente, no a todos
    // client.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no message'
    // })
    // Emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no message'
    // })
// Emite a todos incluido al cliente   
    this.wss.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no message'
    })
  }
```
