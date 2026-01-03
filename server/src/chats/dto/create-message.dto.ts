import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../../common/types';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType = MessageType.TEXT;
}

