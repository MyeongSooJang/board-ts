import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity, ManyToOne } from "typeorm";
import { Member } from "../../member/entity/Member";
import { ValidationException } from "../../exception/ValidationException";
import { UnauthorizedException } from "../../exception/UnauthorizedException";

@Entity()
export class Board {
    @PrimaryGeneratedColumn('increment')
    id!: number;
    @Column()
    title: string;
    @Column()
    content: string | null;
    @ManyToOne(() => Member)
    member: Member;
    @Column()
    viewCount: number = 0;
    @Column()
    commentCount: number = 0;
    @Column()
    likeCount: number = 0;
    @CreateDateColumn()
    createTime!: Date;
    @UpdateDateColumn()
    updateTime!: Date;
    @DeleteDateColumn()
    deleteTime!: Date | null;

    constructor(title: string, content: string | null, member: Member) {
        this.title = title;
        this.content = content;
        this.member = member;
    }

    static create(title: string, content: string | null, member: Member): Board {
        Board.validateTitle(title);
        Board.validateMember(member);
        return new Board(title, content, member);
    }

    private static validateTitle(title: string): void {
        if (!title) {
            throw new ValidationException("제목은 필수입니다");
        }
    }

    private static validateMember(member: Member): void {
        if (!member) {
            throw new ValidationException("작성자는 필수입니다");
        }
    }

    update(title: string, content: string, member: Member): void {
        this.assertWritter(member);
        Board.validateTitle(title);
        this.title = title;
        this.content = content;
    }

    private assertWritter(member: Member): void {
        if (this.member.id !== member.id) {
            throw new UnauthorizedException("자신이 작성하지 않은 게시물은 수정할 수 없습니다");
        }
    }

    delete(member: Member): void {
        this.assertWritter(member);
        this.assertDeleted();
        this.deleteTime = new Date();
    }

    private assertDeleted(): void {
        if (this.deleteTime !== null) {
            throw new ValidationException("삭제된 게시물은 지울 수 없습니다");
        }
    }

    increaseViewCount(): void {
        this.viewCount++;
    }

    increaseLikeCount(): void {
        this.likeCount++;
    }

    decreaseLikeCount(): void {
        this.likeCount--;
    }

    increaseCommentCount(): void {
        this.commentCount++;
    }

    decreaseCommentCount(): void {
        this.commentCount--;
    }
}
