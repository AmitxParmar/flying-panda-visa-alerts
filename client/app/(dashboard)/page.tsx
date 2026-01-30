"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  useGetAlerts,
  useCreateAlert,
  useUpdateAlert,
  useDeleteAlert,
} from "@/hooks/use-alert";
import { Plus, MoreVertical, Loader2, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertForm } from "@/components/forms/alert-form";
import { AlertDialog } from "@/components/common/alert-dialog";
import { VisaAlert, CreateAlertPayload, UpdateAlertPayload } from "@/types";
import { format } from "date-fns";

// Custom hook for intersection observer
function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "100px" }
) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    }, options);

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback, options]);

  return observerRef;
}

export default function DashboardPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isPending,
    error,
    refetch
  } = useGetAlerts();

  console.log('Dashboard State:', { status, isPending, hasData: !!data, error });

  const createMutation = useCreateAlert();
  const updateMutation = useUpdateAlert();
  const deleteMutation = useDeleteAlert();

  // Custom infinite scroll implementation
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const loadMoreRef = useIntersectionObserver(handleLoadMore);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<VisaAlert | null>(null);

  const handleCreate = async (data: any) => {
    // Cast to proper type since form returns generic data
    await createMutation.mutateAsync(data as CreateAlertPayload);
    setIsCreateOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (!editingAlert) return;
    // Cast to proper type
    await updateMutation.mutateAsync({ id: editingAlert.id, data: data as UpdateAlertPayload });
    setEditingAlert(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default'; // primary/black
      case 'Booked': return 'secondary'; // gray
      case 'Expired': return 'destructive'; // red
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage your visa slot alerts here.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Alert
        </Button>
      </div>

      {isPending ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : status === "error" ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-2" />
          <p className="text-lg font-medium">Error loading alerts</p>
          <p className="text-sm text-muted-foreground mb-4">{error?.message}</p>
          <Button variant="link" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.pages.map((page) =>
            page.data.items.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                      {alert.country}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      {alert.city}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAlert(alert)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(alert.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{alert.visaType} Visa</div>
                    <Badge variant={getStatusColor(alert.status) as any}>{alert.status}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(alert.createdAt), "MMM d, yyyy")}
                  </p>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-4 min-h-[50px]">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      </div>

      {/* Create Alert Dialog */}
      <AlertDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create Visa Alert"
        description="Add a new alert to track visa slots."
      >
        <AlertForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateOpen(false)}
        />
      </AlertDialog>

      {/* Edit Alert Dialog */}
      <AlertDialog
        open={!!editingAlert}
        onOpenChange={(open) => !open && setEditingAlert(null)}
        title="Update Visa Alert"
        description="Change the status or details of this alert."
      >
        {editingAlert && (
          <AlertForm
            initialData={editingAlert}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingAlert(null)}
          />
        )}
      </AlertDialog>
    </div>
  );
}
