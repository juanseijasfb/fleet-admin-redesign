import HeaderDashboard from "@/components/HeaderDashboard";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalForm from "@/components/ModalForm";
import DispatcherTable from "@/components/dispatcherTable";
import AddDispatcherForm from "@/components/forms/AddDispatchForm";
import useCreateDispatch from "@/hooks/api/useCreateDispatch";
import useGetDispatchers from "@/hooks/api/useGetDispatcher";
import { useDisclosure } from "@nextui-org/react";

export default function index() {
  const { dispatchers } = useGetDispatchers();
  const modal = useDisclosure();
  const { createDispatch, isPending } = useCreateDispatch(() => {
    modal.onClose();
  });

  return (
    <LayoutDashboard>
      <HeaderDashboard
        title="Dispatchers"
        addButtonText="Create Dispatcher"
        placeholderSearch="Search Dispatcher"
        addButtonAction={() => modal.onOpen()}
      />
      <div className="px-10">
        {<DispatcherTable rows={dispatchers ?? []} />}
      </div>
      <ModalForm isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
        <AddDispatcherForm
          isLoading={isPending}
          onSubmit={(values) => {
            createDispatch(values);
          }}
        />
      </ModalForm>
    </LayoutDashboard>
  );
}
