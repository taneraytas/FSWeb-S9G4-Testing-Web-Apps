import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  // Arrange
  render(<IletisimFormu />);
  // Act
  const iletisimFormu = screen.getByText(/İletişim Formu/i);
  // Assert
  expect(iletisimFormu).toBeInTheDocument;
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimInput, "Foo");
  expect(screen.getByTestId("error")).toHaveTextContent(
    "Hata: ad en az 5 karakter olmalıdır."
  );
  expect(screen.queryAllByTestId("error")).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const btn = screen.getByText("Gönder");
  userEvent.click(btn);
  expect(screen.getAllByTestId("error")).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByLabelText("Ad*");
  const soyisimInput = screen.getByLabelText("Soyad*");
  const btn = screen.getByRole("button", "submit");
  userEvent.type(isimInput, "ilhan");
  userEvent.type(soyisimInput, "mansiz");
  userEvent.click(btn);
  expect(screen.queryAllByTestId("error")).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const mailInput = screen.getByLabelText("Email*");
  userEvent.type(mailInput, "abc");
  expect(screen.getByTestId("error")).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByLabelText("Ad*");
  const emailInput = screen.getByLabelText("Email*");
  const btn = screen.getByRole("button", "submit");

  userEvent.type(isimInput, "John Doe");
  userEvent.type(emailInput, "asdasdasdas@hotmail.com");
  userEvent.click(btn);

  expect(screen.getByTestId("error")).toHaveTextContent(
    "Hata: soyad gereklidir."
  );
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByLabelText("Ad*");
  const soyisimInput = screen.getByLabelText("Soyad*");
  const emailInput = screen.getByLabelText("Email*");
  const btn = screen.getByRole("button", "submit");

  userEvent.type(isimInput, "John Doe");
  userEvent.type(soyisimInput, "Surname");
  userEvent.type(emailInput, "asdasdasdas@hotmail.com");
  userEvent.click(btn);

  expect(screen.queryAllByTestId("error")).toHaveLength(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {});
