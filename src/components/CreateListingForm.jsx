import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateListingMutation, useGetProfileQuery } from '../features/api/apiSlice'
import { useToast } from '../hooks/use-toast'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Loader2 } from 'lucide-react'

const CreateListingForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [createListing, { isLoading }] = useCreateListingMutation()
  const { data: profileData } = useGetProfileQuery()
  
  const [formData, setFormData] = useState({
    funTokenAmount: '',
    priceInFunToken: '',
    minLimit: '',
    maxLimit: '',
    paymentMethods: []
  })

  const [errors, setErrors] = useState({})

  const paymentMethodOptions = [
    { id: 'Bank Transfer', label: 'Bank Transfer' },
    { id: 'UPI', label: 'UPI' }
  ]

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePaymentMethodChange = (methodId, checked) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: checked 
        ? [...prev.paymentMethods, methodId]
        : prev.paymentMethods.filter(id => id !== methodId)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate required fields
    if (!formData.funTokenAmount || formData.funTokenAmount <= 0) {
      newErrors.funTokenAmount = 'FUN token amount must be greater than 0'
    }
    
    if (!formData.priceInFunToken || formData.priceInFunToken <= 0) {
      newErrors.priceInFunToken = 'Price must be greater than 0'
    }
    
    if (!formData.minLimit || formData.minLimit <= 0) {
      newErrors.minLimit = 'Minimum limit must be greater than 0'
    }
    
    if (!formData.maxLimit || formData.maxLimit <= 0) {
      newErrors.maxLimit = 'Maximum limit must be greater than 0'
    }
    
    if (formData.paymentMethods.length === 0) {
      newErrors.paymentMethods = 'Please select at least one payment method'
    }

    // Validate min/max relationship
    if (formData.minLimit && formData.maxLimit && Number(formData.minLimit) > Number(formData.maxLimit)) {
      newErrors.minLimit = 'Minimum limit cannot be greater than maximum limit'
    }

    // Validate max limit against token amount
    if (formData.maxLimit && formData.funTokenAmount && Number(formData.maxLimit) > Number(formData.funTokenAmount)) {
      newErrors.maxLimit = 'Maximum limit cannot be greater than token amount'
    }

    // Check if user has enough tokens
    if (profileData?.data?.balances?.funToken < Number(formData.funTokenAmount)) {
      newErrors.funTokenAmount = 'Insufficient FUN token balance'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const listingData = {
        funTokenAmount: Number(formData.funTokenAmount),
        priceInFunToken: Number(formData.priceInFunToken),
        minLimit: Number(formData.minLimit),
        maxLimit: Number(formData.maxLimit),
        paymentMethods: formData.paymentMethods
      }

      const result = await createListing(listingData).unwrap()
      
      toast({
        title: "Success",
        description: "Listing created successfully!",
      })
      
      // Navigate to my listings or market page
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to create listing',
        variant: "destructive",
      })
    }
  }

  const userBalance = profileData?.data?.balances?.funToken || 0

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Card className="bg-white border-zinc-200 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60 hover:border-zinc-300 transition-all duration-300 p-2">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-zinc-900">Create New Listing</CardTitle>
          <p className="text-sm text-zinc-600 mt-2">
            Available FUN Tokens: <span className="font-semibold text-zinc-900">{userBalance.toLocaleString()}</span>
          </p>
        </CardHeader>
        <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FUN Token Amount */}
          <div className="space-y-2">
            <Label htmlFor="funTokenAmount" className="text-zinc-700 font-medium">FUN Token Amount *</Label>
            <Input
              id="funTokenAmount"
              type="number"
              min="1"
              step="1"
              value={formData.funTokenAmount}
              onChange={(e) => handleInputChange('funTokenAmount', e.target.value)}
              placeholder="Enter amount of FUN tokens to sell"
              className={`bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 ${errors.funTokenAmount ? 'border-red-500' : ''}`}
            />
            {errors.funTokenAmount && (
              <p className="text-sm text-red-600">{errors.funTokenAmount}</p>
            )}
          </div>

          {/* Price per FUN Token */}
          <div className="space-y-2">
            <Label htmlFor="priceInFunToken" className="text-zinc-700 font-medium">Price per FUN Token (INR) *</Label>
            <Input
              id="priceInFunToken"
              type="number"
              min="1"
              step="0.01"
              value={formData.priceInFunToken}
              onChange={(e) => handleInputChange('priceInFunToken', e.target.value)}
              placeholder="Enter price per FUN token in INR"
              className={`bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 ${errors.priceInFunToken ? 'border-red-500' : ''}`}
            />
            {errors.priceInFunToken && (
              <p className="text-sm text-red-600">{errors.priceInFunToken}</p>
            )}
          </div>

          {/* Minimum Limit */}
          <div className="space-y-2">
            <Label htmlFor="minLimit" className="text-zinc-700 font-medium">Minimum Order Limit (FUN Tokens) *</Label>
            <Input
              id="minLimit"
              type="number"
              min="1"
              step="1"
              value={formData.minLimit}
              onChange={(e) => handleInputChange('minLimit', e.target.value)}
              placeholder="Minimum tokens per order"
              className={`bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 ${errors.minLimit ? 'border-red-500' : ''}`}
            />
            {errors.minLimit && (
              <p className="text-sm text-red-600">{errors.minLimit}</p>
            )}
          </div>

          {/* Maximum Limit */}
          <div className="space-y-2">
            <Label htmlFor="maxLimit" className="text-zinc-700 font-medium">Maximum Order Limit (FUN Tokens) *</Label>
            <Input
              id="maxLimit"
              type="number"
              min="1"
              step="1"
              value={formData.maxLimit}
              onChange={(e) => handleInputChange('maxLimit', e.target.value)}
              placeholder="Maximum tokens per order"
              className={`bg-white border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 ${errors.maxLimit ? 'border-red-500' : ''}`}
            />
            {errors.maxLimit && (
              <p className="text-sm text-red-600">{errors.maxLimit}</p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">Payment Methods *</Label>
            <div className="space-y-2">
              {paymentMethodOptions.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-3 rounded-lg bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-200">
                  <Checkbox
                    id={method.id}
                    checked={formData.paymentMethods.includes(method.id)}
                    onCheckedChange={(checked) => handlePaymentMethodChange(method.id, checked)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor={method.id} className="text-sm font-normal text-zinc-700 cursor-pointer">
                    {method.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.paymentMethods && (
              <p className="text-sm text-red-600">{errors.paymentMethods}</p>
            )}
          </div>

          {/* Order Summary */}
          {formData.funTokenAmount && formData.priceInFunToken && (
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-200">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Total FUN Tokens:</span>
                  <span className="font-semibold text-zinc-900">{Number(formData.funTokenAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Price per Token:</span>
                  <span className="font-semibold text-zinc-900">₹{Number(formData.priceInFunToken).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold pt-3 border-t border-zinc-300">
                  <span className="text-zinc-900">Total Value:</span>
                  <span className="text-green-600 text-lg">₹{(Number(formData.funTokenAmount) * Number(formData.priceInFunToken)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-green-700/40 transition-all duration-300 hover:scale-105"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Listing
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateListingForm
