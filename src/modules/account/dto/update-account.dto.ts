import { PartialType } from '@nestjs/mapped-types';
import { CreatAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreatAccountDto) {}
