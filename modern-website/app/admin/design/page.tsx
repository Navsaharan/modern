"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../auth-provider"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface DesignSettings {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    baseSize: string
    scale: string
  }
  animations: {
    enabled: boolean
    pageTransition: string
    buttonHover: string
  }
  layout: {
    maxWidth: string
    gutter: string
  }
}

export default function DesignAdmin() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<DesignSettings>({
    colors: {
      primary: "#1E90FF",
      secondary: "#FFD700",
      background: "#F5F5F5",
      text: "#333333",
    },
    typography: {
      headingFont: "Montserrat",
      bodyFont: "Roboto",
      baseSize: "16px",
      scale: "1.2",
    },
    animations: {
      enabled: true,
      pageTransition: "fade",
      buttonHover: "scale",
    },
    layout: {
      maxWidth: "1200px",
      gutter: "2rem",
    },
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase.from("design_settings").select("*")

        if (error) throw error

        if (data && data.length > 0) {
          const settingsObj: Partial<DesignSettings> = {}

          data.forEach((setting) => {
            settingsObj[setting.name as keyof DesignSettings] = setting.value
          })

          setSettings({
            colors: settingsObj.colors || settings.colors,
            typography: settingsObj.typography || settings.typography,
            animations: settingsObj.animations || settings.animations,
            layout: settingsObj.layout || settings.layout,
          })
        }
      } catch (error) {
        console.error("Error fetching design settings:", error)
        toast({
          title: "Error",
          description: "Failed to load design settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSettings(false)
      }
    }

    if (user) {
      fetchSettings()
    }
  }, [user, toast])

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const supabase = createBrowserSupabaseClient()

      // Update each setting category
      const updates = Object.entries(settings).map(([name, value]) => {
        return supabase.from("design_settings").update({ value }).eq("name", name)
      })

      await Promise.all(updates)

      toast({
        title: "Success",
        description: "Design settings saved successfully.",
      })

      // Refresh the page to apply changes
      router.refresh()
    } catch (error) {
      console.error("Error saving design settings:", error)
      toast({
        title: "Error",
        description: "Failed to save design settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleColorChange = (key: keyof DesignSettings["colors"], value: string) => {
    setSettings({
      ...settings,
      colors: {
        ...settings.colors,
        [key]: value,
      },
    })
  }

  const handleTypographyChange = (key: keyof DesignSettings["typography"], value: string) => {
    setSettings({
      ...settings,
      typography: {
        ...settings.typography,
        [key]: value,
      },
    })
  }

  const handleAnimationsChange = (key: keyof DesignSettings["animations"], value: any) => {
    setSettings({
      ...settings,
      animations: {
        ...settings.animations,
        [key]: value,
      },
    })
  }

  const handleLayoutChange = (key: keyof DesignSettings["layout"], value: string) => {
    setSettings({
      ...settings,
      layout: {
        ...settings.layout,
        [key]: value,
      },
    })
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Settings</h1>
          <p className="text-muted-foreground">Customize the look and feel of your website.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving || isLoadingSettings}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLoadingSettings ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>Customize the colors used throughout your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={settings.colors.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.colors.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={settings.colors.text}
                        onChange={(e) => handleColorChange("text", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.colors.text}
                        onChange={(e) => handleColorChange("text", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-md"
                      style={{ backgroundColor: settings.colors.background, color: settings.colors.text }}
                    >
                      <h4 className="font-bold">Background & Text</h4>
                      <p>This is how your background and text colors look together.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="p-4 rounded-md text-white" style={{ backgroundColor: settings.colors.primary }}>
                        Primary Color
                      </div>
                      <div
                        className="p-4 rounded-md"
                        style={{ backgroundColor: settings.colors.secondary, color: "#000" }}
                      >
                        Secondary Color
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Customize the fonts and text sizes used on your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Input
                      id="headingFont"
                      value={settings.typography.headingFont}
                      onChange={(e) => handleTypographyChange("headingFont", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a Google Font name (e.g., Montserrat, Roboto)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Body Font</Label>
                    <Input
                      id="bodyFont"
                      value={settings.typography.bodyFont}
                      onChange={(e) => handleTypographyChange("bodyFont", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a Google Font name (e.g., Roboto, Open Sans)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseSize">Base Font Size</Label>
                    <Input
                      id="baseSize"
                      value={settings.typography.baseSize}
                      onChange={(e) => handleTypographyChange("baseSize", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a CSS size value (e.g., 16px, 1rem)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scale">Type Scale</Label>
                    <Input
                      id="scale"
                      value={settings.typography.scale}
                      onChange={(e) => handleTypographyChange("scale", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a scale ratio (e.g., 1.2 for minor third)</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div
                    className="p-4 rounded-md border"
                    style={{
                      fontFamily: `"${settings.typography.bodyFont}", sans-serif`,
                      fontSize: settings.typography.baseSize,
                    }}
                  >
                    <h1
                      style={{
                        fontFamily: `"${settings.typography.headingFont}", sans-serif`,
                        fontSize: `calc(${settings.typography.baseSize} * ${settings.typography.scale} * ${settings.typography.scale} * ${settings.typography.scale})`,
                        marginBottom: "0.5em",
                      }}
                    >
                      Heading 1
                    </h1>
                    <h2
                      style={{
                        fontFamily: `"${settings.typography.headingFont}", sans-serif`,
                        fontSize: `calc(${settings.typography.baseSize} * ${settings.typography.scale} * ${settings.typography.scale})`,
                        marginBottom: "0.5em",
                      }}
                    >
                      Heading 2
                    </h2>
                    <h3
                      style={{
                        fontFamily: `"${settings.typography.headingFont}", sans-serif`,
                        fontSize: `calc(${settings.typography.baseSize} * ${settings.typography.scale})`,
                        marginBottom: "0.5em",
                      }}
                    >
                      Heading 3
                    </h3>
                    <p style={{ marginBottom: "1em" }}>
                      This is a paragraph of text that shows how your body font will look on your website. The quick
                      brown fox jumps over the lazy dog.
                    </p>
                    <p>
                      <a href="#" style={{ color: settings.colors.primary }}>
                        This is a link
                      </a>{" "}
                      within a paragraph of text.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Animations</CardTitle>
                <CardDescription>Configure animations and transitions for your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animations-enabled"
                    checked={settings.animations.enabled}
                    onCheckedChange={(checked) => handleAnimationsChange("enabled", checked)}
                  />
                  <Label htmlFor="animations-enabled">Enable animations</Label>
                </div>

                <div className={settings.animations.enabled ? "" : "opacity-50 pointer-events-none"}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageTransition">Page Transition</Label>
                      <select
                        id="pageTransition"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={settings.animations.pageTransition}
                        onChange={(e) => handleAnimationsChange("pageTransition", e.target.value)}
                      >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="scale">Scale</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buttonHover">Button Hover Effect</Label>
                      <select
                        id="buttonHover"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={settings.animations.buttonHover}
                        onChange={(e) => handleAnimationsChange("buttonHover", e.target.value)}
                      >
                        <option value="scale">Scale</option>
                        <option value="lift">Lift</option>
                        <option value="glow">Glow</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout</CardTitle>
                <CardDescription>Configure the layout settings for your website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxWidth">Max Content Width</Label>
                    <Input
                      id="maxWidth"
                      value={settings.layout.maxWidth}
                      onChange={(e) => handleLayoutChange("maxWidth", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a CSS size value (e.g., 1200px, 80rem)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gutter">Gutter Size</Label>
                    <Input
                      id="gutter"
                      value={settings.layout.gutter}
                      onChange={(e) => handleLayoutChange("gutter", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Enter a CSS size value (e.g., 2rem, 32px)</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Preview</h3>
                  <div
                    className="p-4 rounded-md border relative"
                    style={{ maxWidth: settings.layout.maxWidth, margin: "0 auto" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Max width: {settings.layout.maxWidth}
                    </div>
                    <div
                      className="h-16 rounded-md bg-muted flex items-center justify-center"
                      style={{ padding: settings.layout.gutter }}
                    >
                      <div className="bg-background rounded-md w-full h-full flex items-center justify-center">
                        Gutter: {settings.layout.gutter}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

