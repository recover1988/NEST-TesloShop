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
        productImage => productImage.product,
        { cascade: true }
    )
    images?: ProductImage;
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
