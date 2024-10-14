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
import { Signinvalidation } from "../../lib/validation"
import Loader from "../../components/shared/Loader"
import { useToast } from "../../hooks/use-toast.ts"
import { useSignInAccount } from "../../lib/react-query/QueriesAndMutations"
import { useUserContext } from "../../context/AuthContext"




const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext()

  const {mutateAsync: signInAccount} = useSignInAccount()

  const form = useForm<z.infer<typeof Signinvalidation>>({
    resolver: zodResolver(Signinvalidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof Signinvalidation>) {
    
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

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log In To Your Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcome Back</p>

      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
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
        {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
      </form>
      </div>
    </Form>
  )
}

export default SigninForm
