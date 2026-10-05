import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "../../board/entity/Board";
import { Member } from "../../member/entity/Member";
import { ValidationException } from "../../exception/ValidationException";
import { UnauthorizedException } from "../../exception/UnauthorizedException";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('increment')
    id!: number;
    @ManyToOne(() => Board)
    readonly board!: Board;
    @ManyToOne(() => Comment, (comment) => comment.children)
    readonly parent!: Comment | null;
    @OneToMany(() => Comment, (comment) => comment.parent)
    readonly children!: Comment[];
    @Column()
    content: string;
    @ManyToOne(() => Member)
    readonly member!: Member;
    @CreateDateColumn()
    readonly createdTime!: Date;
    @UpdateDateColumn()
    readonly updatedTime!: Date;
    @DeleteDateColumn()
    deletedTime!: Date | null;

    protected constructor(content: string, member: Member, board: Board, parent?: Comment) {
        this.content = content;
        this.member = member;
        this.board = board;
        this.parent = parent ?? null;
    }

    static create(content: string, member: Member, board: Board, parent?: Comment): Comment {
        this.validateContent(content);
        this.validateMember(member);
        this.validateBoard(board);
        return new Comment(content, member, board, parent);
    }

    static validateContent(content: string): void {
        if (!content) {
            throw new ValidationException("내용은 필수입니다")
        }
    }

    static validateMember(member: Member): void {
        if (!member) {
            throw new ValidationException("작성자는 필수입니다");
        }
    }

    static validateBoard(board: Board): void {
        if (!board) {
            throw new ValidationException("게시물은 필수입니다");
        }
    }

    update(content: string, member: Member): void {
        Comment.validateContent(content);
        this.assertWritter(member);
        this.content = content;
    }

    delete(member: Member): void {
        this.assertWritter(member);
        this.deletedTime = new Date();
    }

    private assertWritter(member: Member): void {
        if (this.member.id !== member.id) {
            throw new UnauthorizedException("해당 게시글의 작성가 아닙니다");
        }
    }

    isDeleted(): boolean {
        if (this.deletedTime !== null) {
            return true;
        }
        return false;
    }
}