import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Newspaper, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";

export default function News() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", { category: filterCategory !== "all" ? filterCategory : undefined }],
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "program_updates", label: "Program Updates" },
    { value: "success_stories", label: "Success Stories" },
    { value: "research", label: "Research" },
    { value: "events", label: "Events" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-accent/10 via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <div className="inline-block animate-in fade-in zoom-in-95 duration-700">
            <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
          </div>
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
            News & Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            Stay updated with our latest impact stories, program updates, and healthcare insights
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-background border-b sticky top-16 md:top-20 z-40 backdrop-blur-sm bg-background/95">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="font-semibold text-lg">Filter by Category</h2>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[250px]" data-testid="select-category-filter">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts
                .filter((post) => post.isPublished)
                .map((post, index) => (
                  <Card
                    key={post.id}
                    className="hover-elevate active-elevate-2 transition-all overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`post-card-${post.id}`}
                  >
                    {post.imageUrl && (
                      <div className="aspect-video relative">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary">{post.category.replace(/_/g, " ")}</Badge>
                        {post.publishedAt && (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-headings font-semibold text-xl mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-medium text-primary"
                        asChild
                        data-testid={`button-read-${post.id}`}
                      >
                        <Link href={`/news/${post.slug}`} className="inline-flex items-center">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No Posts Found</h3>
              <p className="text-muted-foreground">
                {filterCategory !== "all"
                  ? "Try changing your filter selection"
                  : "Check back soon for new stories and updates"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
