import * as z from "zod"
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.tsx"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx"
import { Input } from "../../components/ui/input.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Signupvalidation } from "../../lib/validation"
import Loader from "../../components/shared/Loader"
import { useToast } from "../../hooks/use-toast.ts"
import { useCreateUserAccount, useSignInAccount } from "../../lib/react-query/QueriesAndMutations"
import { useUserContext } from "../../context/AuthContext"




const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext()

  const {mutateAsync: createUserAccount, isPending: isCreatingAccount} = useCreateUserAccount()
  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()

  const form = useForm<z.infer<typeof Signupvalidation>>({
    resolver: zodResolver(Signupvalidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof Signupvalidation>) {
    
    const newUser = await createUserAccount(values)

    if(!newUser) {
      return toast({
        title: "Sign up failed. Please try again."})
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return toast({
        title: "Sign in failed. Please try again."})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset()
      navigate('/')
    } else{
        toast({ title: "Login failed. Please try again.", });

        return
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/asset/images/logo.svg"/>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">zCreate a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram enter your details</p>

      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
        {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
      </form>
      </div>
    </Form>
  )
}

export default SignupForm
