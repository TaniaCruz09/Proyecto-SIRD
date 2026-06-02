import * as moment from "moment-timezone";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "src/module/auth/entities";

@Entity({ schema: "catalogos", name: "notaCualitativa" })
export class NotaCualitativa {
  @PrimaryGeneratedColumn("increment", {
    name: "id",
    type: "int4",
  })
  id?: number;

  @Column({
    name: "nombre",
    type: "varchar",
    length: 100,
  })
  nombre: string;

  @Column({
    name: "abreviatura",
    type: "varchar",
    length: 20,
  })
  abreviatura: string;

  @Column({
    name: "rango_menor",
    type: "int4",
  })
  rango_menor: number;

  @Column({
    name: "rango_mayor",
    type: "int4",
  })
  rango_mayor: number;

  @Column({ name: "user_create_id", type: "int4", nullable: true })
  user_create_id: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) =>
        moment(value).tz("America/Managua").format("YYYY-MM-DD hh:mm A"),
    },
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "update_at",
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP",
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) =>
        moment(value).tz("America/Managua").format("YYYY-MM-DD hh:mm A"),
    },
  })
  update_at: Date;

  @Column({ name: "user_update_id", type: "int4", nullable: true })
  user_update_id: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
  deleted_at: Date;

  @Column({ name: "deleted_at_id", type: "int4", nullable: true })
  deleted_at_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_create_id" })
  user_create: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_update_id" })
  user_update: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "deleted_at_id" })
  user_delete: User;
}
