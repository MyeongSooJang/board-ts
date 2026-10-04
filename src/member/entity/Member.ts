import {
  Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn, Entity,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Role } from "./Role";
import { UnauthorizedException } from "../../exception/UnauthorizedException";


@Entity()
export class Member {
    @PrimaryGeneratedColumn('increment')
    id!: number;
    @Column()
    username: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    name: string;
    @Column()
    age: number;
    @Column()
    role: Role;

    @CreateDateColumn()
    createTime!: Date;

    @UpdateDateColumn()
    updateTime!: Date;

    @DeleteDateColumn()
    deleteTime: Date | null;

    constructor(username: string, email: string, password: string, name: string, age: number, role? : Role) {
        this.username = username
        this.email = email;
        this.password = bcrypt.hashSync(password,10);
        this.name = name;
        this.age = age;
        this.role = role ?? Role.GENERAL;
        this.deleteTime = null;
    }

    verifyPassword(inputpassword: string): void {
        if(!bcrypt.compareSync(inputpassword, this.password)){
            throw new UnauthorizedException("비밀번호가 맞지 않습니다.");
        }
    }

}