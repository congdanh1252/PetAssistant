export default class Appointment {
    constructor() {
      this._id = '';
      this.third_party_id = '';
      this.third_party_name = '';
      this.third_party_thumbnail = '';
      this.third_party_address = '';
      this.customer_id = '';
      this.customer_name = '';
      this.customer_phone_number = '';
      this.service = new Array();
      this.appointment_date = '';
      this.appointment_time = '';
      this.created_at = '';
      this.note = '';
      this.status = '';
      this.status_code = 0;
    }

    update(data) {
        this._id = data._id || '';
        this.third_party_id = data.third_party_id || '';
        this.third_party_name = data.third_party_name || '';
        this.third_party_thumbnail = data.third_party_thumbnail || '';
        this.third_party_address = data.third_party_address || '';
        this.customer_id = data.customer_id || '';
        this.customer_name = data.customer_name || '';
        this.customer_phone_number = data.customer_phone_number || '';
        this.service = data.service || new Array();
        this.appointment_date = data.appointment_date || '';
        this.appointment_time = data.appointment_time || '';
        this.created_at = data.created_at || '';
        this.note = data.note || '';
        this.status = data.status || '';
        this.status_code = data.status_code || 0;
    }

    static clone(data) {
      const appointment = new Appointment();
      appointment.update(data);
      return appointment;
    }
}