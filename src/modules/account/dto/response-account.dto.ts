import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Example account' })
  name: string;

  @ApiProperty({ example: 1000 })
  balance: number;
}
