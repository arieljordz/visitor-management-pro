import { Visitor, User } from '@/types/visitor';

export const mockUser: User = {
  id: '1',
  email: 'admin@company.com',
  name: 'John Admin',
  role: 'admin'
};

export const mockVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    purpose: 'Business Meeting',
    hostName: 'Sarah Wilson',
    checkInTime: new Date('2024-01-15T09:00:00'),
    status: 'checked-in'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@consulting.com',
    phone: '+1 (555) 987-6543',
    company: 'Consulting Partners',
    purpose: 'Project Discussion',
    hostName: 'Mike Davis',
    checkInTime: new Date('2024-01-15T10:30:00'),
    checkOutTime: new Date('2024-01-15T12:00:00'),
    status: 'checked-out'
  },
  {
    id: '3',
    name: 'Carol Brown',
    email: 'carol@designstudio.com',
    phone: '+1 (555) 456-7890',
    company: 'Design Studio',
    purpose: 'Design Review',
    hostName: 'Lisa Chen',
    checkInTime: new Date('2024-01-15T14:00:00'),
    status: 'checked-in'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@startup.io',
    phone: '+1 (555) 234-5678',
    company: 'Startup Inc.',
    purpose: 'Investment Pitch',
    hostName: 'Tom Anderson',
    checkInTime: new Date('2024-01-15T11:00:00'),
    checkOutTime: new Date('2024-01-15T13:30:00'),
    status: 'checked-out'
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@marketing.com',
    phone: '+1 (555) 345-6789',
    company: 'Marketing Solutions',
    purpose: 'Campaign Planning',
    hostName: 'Jennifer Lee',
    checkInTime: new Date('2024-01-15T15:30:00'),
    status: 'checked-in'
  }
];