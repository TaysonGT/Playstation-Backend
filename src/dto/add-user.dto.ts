export class addUserDto {
    id:string;
    username: string;
    password: string;
    role: 'admin'|'employee';
}