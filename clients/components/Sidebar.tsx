'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Navigator } from '@/types/navigator';
import React from 'react';
import { getNavigators } from '@/services/navigator-api';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import UserMenu from './UserMenu';

const NavigatorItem = ({ item, level = 0 }: { item: Navigator; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <Link
        href={item.link || '#'}
        className={`flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors ${
          level > 0 ? 'ml-6' : ''
        }`}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {item.icon && (
              <Image 
                src={`/icons/${item.icon}.svg`}
                alt={item.label}
                width={20}
                height={20}
              />
            )}
            <span>{item.label}</span>
          </div>
          {hasChildren && (
            <span className="ml-2">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>
      </Link>
      {hasChildren && isOpen && item.children && (
        <div className="ml-4">
          {item.children.map((child) => (
            <NavigatorItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState<Navigator[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getNavigators();
        // Filter to get only root level items (items without parent)
        const rootItems = response.filter((item: Navigator) => !item.parentId);
        // Build tree structure
        const buildTree = (items: Navigator[], parentId: number | null = null): Navigator[] => {
          return items
            .filter((item) => item.parentId === parentId)
            .map((item) => ({
              ...item,
              children: buildTree(items, item.id),
            }));
        };
        setMenuItems(buildTree(response));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Easy Order</h1>
      </div>
      <nav className="px-4 flex-grow">
        {menuItems.map((item) => (
          <NavigatorItem key={item.id} item={item} />
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <UserMenu />
      </div>
    </div>
  );
};

export default Sidebar; 