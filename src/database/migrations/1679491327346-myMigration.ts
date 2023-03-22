import {MigrationInterface, QueryRunner} from "typeorm";

export class myMigration1679491327346 implements MigrationInterface {
    name = 'myMigration1679491327346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3122b4b8709577da50e89b6898\` ON \`user\``);
        await queryRunner.query(`CREATE TABLE \`trxref\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`reference\` varchar(199) NOT NULL, \`expire_at\` datetime NULL, \`status\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ee11f66eb4141acec5d59a4e05\` (\`reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trxref\` ADD CONSTRAINT \`FK_bc53dccb072c5f582897de2e443\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trxref\` DROP FOREIGN KEY \`FK_bc53dccb072c5f582897de2e443\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee11f66eb4141acec5d59a4e05\` ON \`trxref\``);
        await queryRunner.query(`DROP TABLE \`trxref\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_3122b4b8709577da50e89b6898\` ON \`user\` (\`address\`)`);
    }

}
