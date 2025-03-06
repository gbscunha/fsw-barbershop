"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"
import { format, set } from "date-fns"
import { useSession } from "next-auth/react"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog } from "@radix-ui/react-dialog"
import SignInDialog from "./sign-in-dialog"
import { DialogContent } from "./ui/dialog"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
]

const getTimeList = (bookings: Booking[]) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )
    if (hasBookingOnCurrentTime) {
      return false
    }
    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const { data } = useSession()
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [booinkingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, service.id])

  const handleBookingClick = () => {
    if (!data?.user) {
      setSignInDialogIsOpen(true)
    }
    return setBookingSheetIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined),
      setSelectedTime(undefined),
      setDayBookings([]),
      setBookingSheetIsOpen(false)
  }

  const handleDateSelected = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    // Não exibir os horários que já foram reservados
    // Salvar o agendamento do usuário logado
    // Não deixar o usuário reservar se não estiver logado

    try {
      if (!selectedDay || !selectedTime) return

      const hour = selectedTime?.split(":")[0]
      // ["09": "00"]
      const minute = selectedTime?.split(":")[1]
      const newDate = set(selectedDay, {
        hours: Number(hour),
        minutes: Number(minute),
      })
      await createBooking({
        serviceId: service.id,
        date: newDate,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso")
    } catch (error) {
      toast.error("Erro ao criar reserva")
    }
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* Imagem */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          {/* Parte da Direita */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* Preço e Botão */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={booinkingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      selected={selectedDay}
                      onSelect={handleDateSelected}
                      fromDate={new Date()}
                      locale={ptBR}
                      classNames={{
                        head_cell: "w-full capitalize",
                        cell: "w-full",
                        button: "w-full",
                        nav_button_previous: "w-8 h-8",
                        nav_button_next: "w-8 h-8",
                        caption: "capitalize flex items-center justify-between",
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {getTimeList(dayBookings).map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleTimeSelected(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  {selectedTime && selectedDay && (
                    <div className="p-5">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          <div className="p-2">
                            <div className="flex items-center justify-between">
                              <h2 className="font-bold">{service.name}</h2>
                              <p className="text-sm font-bold">
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(Number(service.price))}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-400">Data</p>
                              <p className="text-sm">
                                {format(selectedDay, "d 'de' MMMM", {
                                  locale: ptBR,
                                })}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-400">Horário</p>
                              <p className="text-sm">{selectedTime}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-400">Barbearia</p>
                              <p className="text-sm">{barbershop.name}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  <SheetFooter className="p-5">
                    <Button
                      onClick={handleCreateBooking}
                      disabled={!selectedTime || !selectedDay}
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
