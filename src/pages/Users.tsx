import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'

interface User {
  id: string
  name: string
  email: string
  role: 'User' | 'Admin'
  subscriptionStatus: 'Active' | 'Inactive' | 'Expired'
  signupDate: Date
  lastLogin: Date
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      subscriptionStatus: 'Active',
      signupDate: new Date('2024-01-15'),
      lastLogin: new Date('2024-03-20'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      subscriptionStatus: 'Active',
      signupDate: new Date('2024-02-01'),
      lastLogin: new Date('2024-03-19'),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      subscriptionStatus: 'Expired',
      signupDate: new Date('2024-01-20'),
      lastLogin: new Date('2024-03-15'),
    },
  ])

  const handleViewUser = (userId: string) => {
    // Implement view user logic
    console.log('View user:', userId)
  }

  const handleBanUser = (userId: string) => {
    // Implement ban user logic
    console.log('Ban user:', userId)
  }

  const handleDeleteUser = (userId: string) => {
    // Implement delete user logic
    setUsers(users.filter(user => user.id !== userId))
  }

  const getSubscriptionBadgeVariant = (status: User['subscriptionStatus']) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'secondary'
      case 'Expired':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const getRoleBadgeVariant = (role: User['role']) => {
    return role === 'Admin' ? 'default' : 'secondary'
  }

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button onClick={() => console.log('Add new user')}>
          Add New User
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription Status</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getSubscriptionBadgeVariant(user.subscriptionStatus)}>
                    {user.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell>{format(user.signupDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(user.lastLogin, 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleViewUser(user.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleBanUser(user.id)}
                  >
                    Ban
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Users
