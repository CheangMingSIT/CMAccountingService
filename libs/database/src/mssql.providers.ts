import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { CdrDataParameter } from './schemas/cdr.entity';

export default class mssqlConfig {
  static getMssqlConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mssql',
      host: configService.get('MSSQL_HOST'),
      port: Number(configService.get('MSSQL_PORT')),
      username: configService.get('MSSQL_USER'),
      password: configService.get('MSSQL_PASSWORD'),
      database: configService.get('MSSQL_DB'),
      entities: [CdrDataParameter],
      // synchronize: true,  //only true when forming the table from scratch
      options: {
        encrypt: false, // set true for Azure or TLS-secured environments
        enableArithAbort: true,
      },
      extra: {
        trustServerCertificate: true, // avoid self-signed cert issues
      },
    };
  }
}

export const mssqlConfigAsync: TypeOrmModuleAsyncOptions = {
  name: 'mssql',
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return mssqlConfig.getMssqlConfig(configService);
  },
  inject: [ConfigService],
};
