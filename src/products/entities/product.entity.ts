import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: 'acasdasefasdasd213-131-23-41-fd',
        description: 'Producto Id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Teslo-Tshirt',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })

    title: string;
    @ApiProperty({
        example: 0,
        description: 'Producto Price',
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'lorem ipusemasdas',
        description: 'Producto description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty()
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Producto sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    // user
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

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

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
