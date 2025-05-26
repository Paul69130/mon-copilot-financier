
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Category } from '@/types/financial';
import { Plus, Edit3, Trash2, Save, X, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<string>;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onUpdateCategories,
  onAddCategory
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3b82f6',
    type: 'expense' as 'income' | 'expense' | 'BS'
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
  ];

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      await onAddCategory(newCategory);
      setNewCategory({
        name: '',
        color: '#3b82f6',
        type: 'expense'
      });

      toast({
        title: "Category Added",
        description: `Category "${newCategory.name}" has been created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    if (category.is_system_category) {
      toast({
        title: "Cannot Edit System Category",
        description: "System categories based on French chart of accounts cannot be modified.",
        variant: "destructive"
      });
      return;
    }
    setEditingId(category.id);
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    );
    
    onUpdateCategories(updatedCategories);
    setEditingId(null);
    setEditingCategory(null);

    toast({
      title: "Category Updated",
      description: `Category "${editingCategory.name}" has been updated.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    
    if (category?.is_system_category) {
      toast({
        title: "Cannot Delete System Category",
        description: "System categories based on French chart of accounts cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);

    toast({
      title: "Category Deleted",
      description: `Category "${category?.name}" has been deleted.`,
    });
  };

  // Separate categories by type
  const systemCategories = categories.filter(c => c.is_system_category);
  const customIncomeCategories = categories.filter(c => !c.is_system_category && c.type === 'income');
  const customExpenseCategories = categories.filter(c => !c.is_system_category && c.type === 'expense');
  const customBSCategories = categories.filter(c => !c.is_system_category && c.type === 'BS');

  const renderCategoryList = (categoryList: Category[], title: string, titleColor: string, allowCustom: boolean = true) => (
    <Card>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
        <CardDescription>
          {allowCustom ? `Custom and system ${title.toLowerCase()}` : `System ${title.toLowerCase()} based on French chart of accounts`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categoryList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No {title.toLowerCase()} yet.</p>
          ) : (
            categoryList.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                {editingId === category.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: editingCategory?.color }}
                    />
                    <Input
                      value={editingCategory?.name || ''}
                      onChange={(e) => setEditingCategory(prev => 
                        prev ? { ...prev, name: e.target.value } : null
                      )}
                      className="flex-1"
                    />
                    <div className="flex gap-1">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditingCategory(prev => 
                            prev ? { ...prev, color } : null
                          )}
                          className={`w-6 h-6 rounded border ${
                            editingCategory?.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {category.is_system_category && <Lock className="h-3 w-3" />}
                        {category.type === 'BS' ? 'Balance Sheet' : 
                         category.type === 'income' ? 'Income' : 'Expense'}
                        {category.account_prefix && ` (${category.account_prefix})`}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        disabled={category.is_system_category}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.is_system_category}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom Category
          </CardTitle>
          <CardDescription>Create custom categories in addition to the automatic French chart of accounts classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                disabled={isAdding}
              />
            </div>
            <div>
              <Label htmlFor="category-type">Type</Label>
              <Select
                value={newCategory.type}
                onValueChange={(value: 'income' | 'expense' | 'BS') => 
                  setNewCategory(prev => ({ ...prev, type: value }))
                }
                disabled={isAdding}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="BS">Balance Sheet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddCategory} className="w-full" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={isAdding}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Categories */}
      {renderCategoryList(systemCategories, "System Categories (French Chart of Accounts)", "text-blue-600", false)}

      {/* Custom Categories by Type */}
      {renderCategoryList(customIncomeCategories, "Custom Income Categories", "text-green-600")}
      {renderCategoryList(customExpenseCategories, "Custom Expense Categories", "text-red-600")}
      {renderCategoryList(customBSCategories, "Custom Balance Sheet Categories", "text-purple-600")}
    </div>
  );
};

export default CategoryManager;
