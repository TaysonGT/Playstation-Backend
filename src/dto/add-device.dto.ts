import { DeviceType } from "../entity/device-type.entity";

export class addDeviceDto {
        name: string;
        type: DeviceType;
        status: boolean;
}