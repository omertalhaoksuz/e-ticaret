"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/services/auth";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: "",
    isBillingAddress: true,
  });

  const [editPassword, setEditPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const fetchAddresses = async () => {
    const res = await fetch("https://localhost:7082/api/Address", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAddresses(data);
  };

  useEffect(() => {
    if (!user) router.push("/login");
    else fetchAddresses();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    const res = await fetch("https://localhost:7082/api/Address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({
        title: "",
        fullName: "",
        phone: "",
        city: "",
        district: "",
        fullAddress: "",
        isBillingAddress: true,
      });
      fetchAddresses();
    } else {
      alert("Address could not be added.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;

    await fetch(`https://localhost:7082/api/Address/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="space-y-4 mb-10">
        <p><strong>Full Name:</strong> {user?.fullName ?? "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <div className="flex items-center gap-2">
          <strong>Password:</strong>
          {editPassword ? (
            <div className="flex flex-col gap-2 w-full max-w-md">
              <Input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
              <Input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
  size="sm"
  onClick={async () => {
    console.log("TRYING TO CHANGE PASSWORD")
    console.log("Current Password:", passwords.currentPassword)
    console.log("New Password:", passwords.newPassword)
    console.log("Token:", token)

    try {
      if (!token) {
        console.error("❌ Token is null — kullanıcı oturumu yok!")
        alert("Giriş yapılmamış. Lütfen tekrar giriş yapın.")
        return
      }

      const response = await changePassword(passwords, token)
      console.log("✅ Password change successful", response)

      alert("Password updated.")
      setEditPassword(false)
      setPasswords({ currentPassword: "", newPassword: "" })
    } catch (error: any) {
      console.error("❌ Failed to update password:", error)
      alert(error.message || "Failed to update password.")
    }
  }}
>
  Save
</Button>

                <Button size="sm" variant="ghost" onClick={() => setEditPassword(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <span className="tracking-widest select-none">
                {showPassword ? "••••••••••" : "********"}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditPassword(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Add New Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="title" placeholder="Address Title" value={form.title} onChange={handleChange} />
          <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <Input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <Input name="district" placeholder="District" value={form.district} onChange={handleChange} />
          <Input name="fullAddress" placeholder="Full Address" value={form.fullAddress} onChange={handleChange} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddAddress}>Save Address</Button>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <CardTitle>{address.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Name:</strong> {address.fullName}</p>
              <p><strong>Phone:</strong> {address.phone}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>District:</strong> {address.district}</p>
              <p><strong>Address:</strong> {address.fullAddress}</p>
              <p><strong>Billing:</strong> {address.isBillingAddress ? "Yes" : "No"}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="destructive" onClick={() => handleDelete(address.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
