import { Order } from './order.entity';
export declare class DeviceSession {
    id: string;
    device_id: string;
    createdAt: string;
    end_at: string;
    time_type: string;
    play_type: string;
    orders?: Order[];
}
