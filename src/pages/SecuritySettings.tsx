import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoFactorSetup } from '@/components/admin/TwoFactorSetup';
import { twoFactorApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const { user } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTwoFactorStatus();
  }, [user]);

  const checkTwoFactorStatus = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const response = await twoFactorApi.checkStatus(user.email);
      setTwoFactorEnabled(response.enabled);
    } catch (error: any) {
      console.error('Failed to check 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    setTwoFactorEnabled(true);
    toast.success('2FA has been enabled for your account');
  };

  if (showSetup) {
    return <TwoFactorSetup email={user?.email || ''} onComplete={handleSetupComplete} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security and authentication methods
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account using Google Authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading 2FA status...
              </div>
            ) : (
              <>
                <div className={`p-4 rounded-lg border ${
                  twoFactorEnabled 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {twoFactorEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {twoFactorEnabled ? '2FA is Enabled' : '2FA is Not Enabled'}
                      </p>
                      <p className="text-sm mt-1">
                        {twoFactorEnabled 
                          ? 'Your account is protected with two-factor authentication. You will need to enter a code from your authenticator app when signing in.'
                          : 'Your account is not protected with two-factor authentication. Enable it now to enhance your security.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {!twoFactorEnabled && (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold text-sm">Why enable 2FA?</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Protects your account even if your password is compromised</li>
                        <li>Requires physical access to your phone to sign in</li>
                        <li>Industry standard security practice</li>
                        <li>Takes only 2 minutes to set up</li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => setShowSetup(true)}
                      className="w-full"
                      variant="hero"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                )}

                {twoFactorEnabled && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      If you've lost access to your authenticator app, you can use one of your backup codes to sign in, then disable and re-enable 2FA.
                    </p>
                    {/* We could add a disable button here if needed */}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div className="text-sm font-medium text-muted-foreground">Email:</div>
              <div className="col-span-2 text-sm font-mono">{user?.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b">
              <div className="text-sm font-medium text-muted-foreground">Role:</div>
              <div className="col-span-2 text-sm">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  {user?.role}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="text-sm font-medium text-muted-foreground">2FA Status:</div>
              <div className="col-span-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  twoFactorEnabled 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;
