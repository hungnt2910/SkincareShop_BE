import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SkinTypeDetails } from "./SkinTypeDetails";

@Entity()
export class SkinType {
    @PrimaryGeneratedColumn()
    skinTypeId: number;

    @Column()
    type: string;

    // @OneToMany(() => SkinTypeDetails, detail => detail.skinType)
    // details: SkinTypeDetails[];
}
