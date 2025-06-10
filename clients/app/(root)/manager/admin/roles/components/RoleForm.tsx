import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createTable, getCategoryByCode, updateTable } from '@/services/manager-api';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Action } from '@/types/actions';
import { Plus, Save, X } from 'lucide-react';
import { Category } from '@/types/category';
import { Role } from '@/types/role';
import { Feature } from '@/types/feature';
import { getRole } from '@/services/auth-api';
import { RoleFormInput } from './RoleFormInput';
import AssignHandleForm from './AssignHandleForm';
import { navigatorService } from '@/services/navigator-api';

const RoleForm = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [role, setRole] = useState<Role>();
  const [formValues, setFormValues] = useState<any>(null);
  const [assignFeatures, setAssignFeatures] = useState<any>();
  const id = params.id as string;


  const title = id ? 'Cập nhật vai trò' : 'Thêm bàn vai trò';
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadRole(id.toString());
    }
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const data = await navigatorService.getNavigators();
      setFeatures(data.data);
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách chức năng: ' + error.message);
    }
  };

  const loadRole = async (id: string) => {
    try {
      const roleData = await getRole(id);
      setRole(roleData)
      setFormValues({
        name: roleData.name,
        description: roleData.description,
        code: role?.code,
        isActive: roleData.isActive,
        feature: roleData.feature
      });
      setAssignFeatures(roleData.feature?.map(item=> item.id))
      console.log(formValues)
    } catch (_error) {
      toast.error('Không thể tải thông tin vai trò');
      router.push('/manager/admin/roles');
    }
  };

  const handleSubmit = async () => {
    if (!formValues) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formValues,
      };

      if (isEditing) {
        await updateTable(id, submitData);
        toast.success('Vai trò đã được cập nhật thành công');
      } else {
        await createTable(submitData);
        toast.success('Vai trò đã được thêm thành công');
      }
      router.push('/manager/admin/roles');
    } catch (_error) {
      toast.error(isEditing ? 'Có lỗi xảy ra khi cập nhật vai trò' : 'Có lỗi xảy ra khi thêm vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target)
    const { name, value, type } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const changeDescription = (description: string) => {
    // Kiểm tra độ dài description
    if (description.length > 2500) {
      toast.error('Mô tả không được quá 2500 ký tự');
      return;
    }

    setFormValues((prev: any) => ({
      ...prev,
      description: description,
    }));
  }

  const onSubmit = async (values: any) => {
    try {

      //   if (selectedRole) {
      //     await updateRole(role.id, values);
      //     toast.success('Cập nhật vai trò thành công');
      //   } else {
      //     const code = await findbyCode(values.code);
      //     if(code){
      //       toast.error('Đã tồn tại mã vai trò vui lòng nhập mã khác');
      //       return;
      //     }
      //     await createRole(values);
      //     toast.success('Tạo vai trò thành công');
      //   }
      //   closeModal();
      //   fetchRoles();

    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Lỗi: ' + error.message);
    }
  };

  const listAction: Action[] = [
    {
      icon: <X className="h-4 w-4" />,
      onClick: () => {
        router.back();
      },
      title: "Hủy",
      className: "hover:bg-gray-100 dark:hover:bg-gray-500 rounded-md transition-colors text-gray-300",
      variant: 'outline'
    },
    {
      icon: isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />,
      onClick: () => handleSubmit(),
      title: isEditing ? "Cập nhật" : "Thêm mới",
      className: "hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors text-blue-500",
      isLoading: loading
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Thêm vai trò" items={[
        { title: 'Danh sách vai trò', href: '/manager/roles' },
        { title: '', href: '#' }
      ]} />
      <div className="space-y-2">
        <ComponentCard title={title} listAction={listAction}>
          <div className="flex flex-col space-y-4">
            {/* Phần input form */}
            <div className="w-full">
              <div className="space-y-2">
                <RoleFormInput 
                  role={role} 
                  onSubmit={onSubmit} 
                  onCancel={() => {}} 
                  onFormChange={(values) => setFormValues(values)}
                />
              </div>
            </div>

            {/* Phần assign handle form */}
            <div className="w-full">
              <AssignHandleForm
                allFeatures={features}
                assignedItems={assignFeatures}
              />
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

export default RoleForm;
