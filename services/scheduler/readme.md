
## Scheduler API

This router provides endpoints to manage schedules for devices.

About interfaces and constants, click [here](interface.ts)

---

### **Create a Daily Schedule**

**POST** `/service/scheduler/daily/:deviceId`

**Request Body:**
```ts
{
 control: string,
 hour?: number,
 minute?: number,
 second?: number
}
```
**Response:**
```ts
{ msg: string }
```
---

### **Create a Custom Schedule**

**POST** `/service/scheduler/custom/:deviceId`

**Request Body:**
```ts
{
 control: string,
 incomingTime?: number,
 repeatTime: number,
 repeatCount?: number
}
```
**Response:**
```ts
{ msg: string }
```
---

### **Get All Schedules of a Device**

**GET** `/service/scheduler/:deviceId`

**Response:**  
```ts
ISchedule[]
```
---

### **Edit a Schedule**

**PUT** `/service/scheduler/:deviceId/schedule-id/:scheduleId`

**Request Body:**
```ts
Partial<ISchedule>
```
**Response:**
```ts
{ msg: string }
```
---

### **Delete Schedules**

**DELETE** `/service/scheduler/:deviceId/schedule-ids/:scheduleIds`

Params: 

- **deviceId**: id of device holding the schedules
- **scheduleIds**: id list of schedules to be deleted, seperated by addition symbol `+`.

**Response:**
```ts
{ msg: string }
```

