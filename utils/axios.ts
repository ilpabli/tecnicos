import axiosInstance from "./axiosInstance";

export const getTickets = async () => {
  try {
    const res = await axiosInstance.get(
      "/tickets?ticket_status=Abierto&ticket_status=En%20proceso"
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTicket = async (ticketId: any) => {
  try {
    const res = await axiosInstance.get(`/tickets/${ticketId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketsAssign = async () => {
  try {
    const res = await axiosInstance.get(`/users/tickets`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const workingTicket = async (ticketId: any, data: any) => {
  try {
    const res = await axiosInstance.put(`/tickets/working/${ticketId}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const res = await axiosInstance.get(`/users/current`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTechnicians = async () => {
  try {
    const res = await axiosInstance.get(`/users/technicians`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const assignTicket = async (ticketId: number, usr: string) => {
  try {
    const res = await axiosInstance.put(`/tickets/assign/${ticketId}`, {
      user: usr,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateLocation = async (user: any, data: any) => {
  try {
    const res = await axiosInstance.put(`/users/${user}/location`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: any) => {
  try {
    const res = await axiosInstance.post(`/users/changepassword`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
