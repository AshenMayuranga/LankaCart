import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { toast } from 'sonner'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  username: z.string().min(3, 'At least 3 characters'),
  email: z.string().email('Valid email required'),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { register: registerUser } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        phoneNumber: data.phoneNumber,
      })
      toast.success('Account created! Welcome to LankaCart.')
      navigate('/')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Registration failed')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join thousands of shoppers on LankaCart</p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                placeholder="Kasun"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                required
                placeholder="Perera"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <Input
              label="Username"
              required
              placeholder="kasun_perera"
              error={errors.username?.message}
              {...register('username')}
            />
            <Input
              label="Email"
              type="email"
              required
              placeholder="kasun@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+94 71 234 5678"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                placeholder="Min 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3 text-base justify-center mt-2"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
