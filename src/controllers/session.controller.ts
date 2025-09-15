import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { addDeviceDto } from "../dto/add-device.dto";
import { timeDto } from "../dto/time-order.dto";
import { Device } from "../entity/device.entity";
import { TimeOrder } from "../entity/time-order.entity";
import { Session } from '../entity/session.entity';
import { Receipt } from "../entity/reciept.entity";
import { User } from "../entity/user.entity";

const sessionRepo = myDataSource.getRepository(Session)
const deviceRepo = myDataSource.getRepository(Device)
const userRepo = myDataSource.getRepository(User)
const timeOrderRepo = myDataSource.getRepository(TimeOrder)
const receiptRepo = myDataSource.getRepository(Receipt)

const findSession = async (req: Request, res: Response) => {
  const { id } = req.params
  const session = await sessionRepo.find({ where: { id } })
  session ? res.json({ success: true, session }) : res.json({ success: false, message: "حدث خطا" })
}

const changeDevice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { destination } = req.body

  const isBusy = await sessionRepo.findOne({ where: { device: {id: destination} } })
  const session = await sessionRepo
  .createQueryBuilder('session')
  .innerJoinAndSelect('session.device', 'device')
  .innerJoinAndSelect('device.type', 'type')
  .where('session.id = :id', {id})
  .getOne()  
  
  if (!session) {
    res.json({ message: "لم يتم العثور على الجلسة", success: false })
    return;
  }

  if (!session.device) {
    res.json({ success: false, message: "مش فاهم حاجة" })
    return;
  }
 
  if (session && session?.time_type == "time" && new Date(session?.ended_at) < new Date()) {
    res.json({ message: " لقد انتهى وقت هذا الجهاز بالفعل", success: false })
    return
  }

  if(isBusy) {
    res.json({ message: "هذا الجهاز مشغول حاليا", success: false })
    return;
  }

  const nextDevice = await deviceRepo.findOne({ where: { id: destination } })

  let cost = 0;

  if (!nextDevice) {
    res.json({ message: "حدث خطأ", success: false })
    return;
  }

  const started_at = Date.now()

  if (session.play_type == "single") {
    const timePrice = session.device.type.single_price
    cost = Math.ceil(((started_at - new Date(session.started_at).getTime()) / (1000 * 60 * 60)) * timePrice)
  } else {
    const timePrice = session.device.type.multi_price
    cost = Math.ceil(((started_at - new Date(session.started_at).getTime()) / (1000 * 60 * 60)) * timePrice)
  }
  try{
    const timeData: timeDto = { session_id: id, play_type: session.play_type, time_type: session.time_type, cost, started_at: new Date(session.started_at) }
    const time_order = timeOrderRepo.create(timeData)
    await timeOrderRepo.save(time_order);
  
    session.device.status = false
    session.device.session = undefined
  
    await deviceRepo.save(session.device)
    
    nextDevice.status = true
    
    await deviceRepo.save(nextDevice)
    
    session.device = nextDevice;
    session.started_at = new Date(started_at) 
  
    await sessionRepo.save(session)
  
    
    res.json({ message: "تم نقل الحساب لجهاز اخر", success: true })
  }catch(error){
    res.json({ message: error.message, success: false })
  }
}

const changePlayType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { play_type } = req.body

  const session = await sessionRepo
  .createQueryBuilder('session')
  .innerJoinAndSelect('session.device', 'device')
  .innerJoinAndSelect('device.type', 'type')
  .where('session.id = :id', {id})
  .getOne()  

  if (!session) {
    res.json({ message: "هذه الجلسة غير موجودة", success: false })
    return;
  }
  
  if (!session.device) {
    res.json({ success: false, message: "مش فاهم حاجة" })
    return;
  }
  
  if (session.time_type == "time" && new Date(session.ended_at) < new Date() && play_type) {
    res.json({ message: " لقد انتهى وقت هذا الجهاز بالفعل", success: false })
    return;
  }
  
  let cost = 0;
  const started_at = Date.now()
  const timeDiff = (started_at - new Date(session.started_at).getTime()) / (1000 * 60 * 60)

  if (session.play_type == "single") {
    const timePrice = session.device.type.single_price
    cost = Math.ceil(timeDiff * timePrice)
  } else {
    const timePrice = session.device.type.multi_price
    cost = Math.ceil(timeDiff * timePrice)
  }

  const timeData: timeDto = { session_id: id, play_type: session.play_type, time_type: session.time_type, cost, started_at: session.started_at }
  const time_order = timeOrderRepo.create(timeData)
  const savedTimeOrder = await timeOrderRepo.save(time_order);

  const newSession = Object.assign(session, { ...session, play_type, started_at })
  const updatedSession = await sessionRepo.save(newSession)

  savedTimeOrder && updatedSession ? res.json({ message: "تم تغيير نوع اللعب", success: true, updatedSession })
    : res.json({ message: "حدث خطأ", success: false })
}

const allSessions = async (req: Request, res: Response) => {
  const sessions = await sessionRepo.find()
  res.json({ sessions })
}

const addSession = async (req: Request, res: Response) => {
  const { play_type, time_type, end_time } = req.body;
  const { id } = req.params
  const device = await deviceRepo.findOne({ where: { id } })
  const checkExists = await sessionRepo.exists({ where: { device_id: id, status: 'running' } })

  if (checkExists) {
    res.json({ message: "هذه الجلسة بدأت بالفعل", succes: false, warning: true })
    return
  }

  if (!device) { 
    res.json({ message: "هذا الجهاز غير موجود" })
    return;
  }

  if (!play_type || !time_type) {
    res.json({ success: false, message: "برجاء ملء جميع البيانات" })
  }

  const updateDeviceData: addDeviceDto = Object.assign({ ...device, status: true })
  const updated = await deviceRepo.save(updateDeviceData)
  const session = sessionRepo.create({
    device, 
    ...(time_type==='time')&&{ended_at: end_time},
    time_type,
    play_type
  })
  
  await sessionRepo.save(session)
  res.json({ success: true, session, updated, message: "تم بدأ الجهاز بنجاح" })
}

const endSession = async (req: Request, res: Response) => {
  const cashier_id = req.headers.user_id?.toString().split(' ')[1];
  const { id } = req.params

  let deviceStatus = false

  const session = await sessionRepo
  .createQueryBuilder('session')
  .innerJoinAndSelect('session.device', 'device')
  .innerJoinAndSelect('device.type', 'type')
  .leftJoinAndSelect('session.orders', 'orders')
  .leftJoinAndSelect('session.time_orders', 'time_orders')
  .where('session.id = :id', {id})
  .getOne()

  if (!session) {
    res.json({ success: false, message: "الجلسة غير موجودة" })
    return;
  }
  
  if (!session.device) {
    res.json({ success: false, message: "مش فاهم حاجة" })
    return;
  }
  
  const cashier = await userRepo.findOne({ where: { id: cashier_id } })
  
  if (!cashier) {
    res.json({ success: false, message: "مستخدم غير موجود" })
    return;
  }

  // UPDATE DEVICE STATE
  const deviceData: addDeviceDto = Object.assign({ ...session.device, name: session.device.name, type: session.device.type, status: deviceStatus })
  const updatedDevice = await deviceRepo.save(deviceData)
  let timeDiff = null;

  // WRAPPING UP FINAL TIME ORDER BEFORE CALCULATING ALL TIME ORDERS
  if (session.time_type == "open") {
    timeDiff = (new Date().getTime() - new Date(session.started_at).getTime()) / (1000 * 60 * 60)
  } else {
    new Date(session.ended_at).getTime() > Date.now() ?
      timeDiff = (Date.now() - new Date(session.started_at).getTime()) / (1000 * 60 * 60)
      : timeDiff = (new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / (1000 * 60 * 60)
  }

  let finalOrderCost = session.play_type === "single"? timeDiff * session.device.type.single_price: timeDiff * session.device.type.multi_price

  const finalTimeOrder = timeOrderRepo.create({ session, started_at: session.started_at, play_type: session.play_type, cost: Math.ceil(finalOrderCost) })
  await timeOrderRepo.save(finalTimeOrder)

  session.time_orders.push(finalTimeOrder)

  // CALCULATING COSTS
  let total = 0;

  session.orders?.map((order) => {
    total += order.cost
  })

  session.time_orders?.map((timeOrder) => total += timeOrder.cost)

  // TIME ORDERS RECEIPT
  const receiptData = receiptRepo.create({
    cashier, 
    total,
    device: session.device,
    orders: session.orders,
    time_orders: session.time_orders,
    type: 'session'
  })

  await receiptRepo.save(receiptData);
  
  session.orders = []
  session.time_orders = []
  session.device = undefined;
  
  // SESSION DELETED
  await sessionRepo.save(session)
  await sessionRepo.remove(session)

  // RESPONSE
  res.json({ success: true, updatedDevice, message: "تم ايقاف الجهاز بنجاح" })
}


export {
  findSession,
  changePlayType,
  changeDevice,
  allSessions,
  addSession,
  endSession,
}