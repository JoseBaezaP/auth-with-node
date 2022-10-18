import {
    Model,
    Column,
    DataType,
    Table,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from "sequelize-typescript";

@Table({
    tableName: 'Users'
})
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    })
    name!: string;

    @Column({
        type: DataType.ENUM('user', 'admin'),
        defaultValue: 'user',
    })
    role!: 'user' | 'admin';

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isLength: {
                min: 6,
            },
        },
    })
    password!: string;
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    password_changed_date!: Date;

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;

    @DeletedAt
    deleted_at!: Date;
}
