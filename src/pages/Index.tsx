import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Copy, Download } from "lucide-react";

type ContentType = "slogan" | "social" | "hashtags" | "product" | "email";

const Index = () => {
  const { toast } = useToast();
  const [contentType, setContentType] = useState<ContentType>("slogan");
  
  const pastelColors = [
    'bg-[hsl(var(--pastel-blue))]',
    'bg-[hsl(var(--pastel-yellow))]',
    'bg-[hsl(var(--pastel-pink))]',
    'bg-[hsl(var(--pastel-green))]',
    'bg-[hsl(var(--pastel-purple))]',
    'bg-[hsl(var(--pastel-orange))]',
  ];
  const [businessName, setBusinessName] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [variations, setVariations] = useState(3);
  const [customPrompt, setCustomPrompt] = useState("");
  const [lastUsedPrompt, setLastUsedPrompt] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const showTargetAudience = ["social", "product", "email"].includes(contentType);
  const showTone = ["slogan", "social", "product", "email"].includes(contentType);
  const showPlatform = ["social", "hashtags"].includes(contentType);

  const handleGenerate = async () => {
    if (!businessName || !productInfo) {
      toast({
        title: "Missing information",
        description: "Please fill in business name and product info",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          contentType,
          businessName,
          productInfo,
          targetAudience,
          tone,
          platform,
          variations,
          customPrompt: customPrompt.trim() || undefined,
        },
      });

      if (error) throw error;

      const content = data.content;
      const prompt = data.prompt;
      const parsedResults = content
        .split("\n")
        .filter((line: string) => line.trim() && /^\d+\./.test(line.trim()))
        .map((line: string) => line.replace(/^\d+\.\s*/, "").trim());

      setResults(parsedResults);
      setLastUsedPrompt(prompt);
      if (!customPrompt) {
        setCustomPrompt(prompt);
      }
      toast({
        title: "Content generated!",
        description: `Created ${parsedResults.length} variation(s)`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  const saveToFile = (text: string, index: number) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentType}-${index + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setBusinessName("");
    setProductInfo("");
    setTargetAudience("");
    setTone("");
    setPlatform("");
    setVariations(3);
    setCustomPrompt("");
    setLastUsedPrompt("");
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
            <h1 className="text-7xl font-bold font-calligraphy bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent whitespace-nowrap">
              Genie
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered marketing content generator for your business
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Content Generator</CardTitle>
              <CardDescription>Fill in the details to generate your marketing content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slogan">Slogans</SelectItem>
                    <SelectItem value="social">Social Media Captions</SelectItem>
                    <SelectItem value="hashtags">Hashtags</SelectItem>
                    <SelectItem value="product">Product Descriptions</SelectItem>
                    <SelectItem value="email">Email Marketing Copy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Business/Product Name</Label>
                <Input
                  placeholder="e.g., TechStart Inc."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Product/Service Info</Label>
                <Textarea
                  placeholder="Describe your product or service..."
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  rows={4}
                />
              </div>

              {showTargetAudience && (
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input
                    placeholder="e.g., Young professionals, 25-35"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              )}

              {showTone && (
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showPlatform && (
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Number of Variations (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={variations}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || val === '0') {
                      setVariations(1);
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (isNaN(num)) return;
                    if (num < 1) {
                      setVariations(1);
                    } else if (num > 5) {
                      setVariations(5);
                    } else {
                      setVariations(num);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      setVariations(1);
                    }
                  }}
                />
              </div>

              {results.length > 0 && (
                <div className="space-y-2">
                  <Label>Edit AI Prompt (Optional)</Label>
                  <Textarea
                    placeholder="Modify the prompt for regenerating content..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Edit the prompt to regenerate content with different instructions</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1"
                  variant="hero"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClear}
                  disabled={loading}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Your AI-generated marketing content</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${loading ? 'animate-pulse text-primary' : 'opacity-20'}`} />
                  <p>Your generated content will appear here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {results.map((result, index) => (
                    <Card key={index} className={`border-primary/10 ${pastelColors[index % pastelColors.length]}`}>
                      <CardContent className="p-4 space-y-3">
                        <p className="text-sm whitespace-pre-wrap text-foreground/90">{result}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(result)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveToFile(result, index)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
