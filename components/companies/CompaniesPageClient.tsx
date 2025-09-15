@@ .. @@
       {/* Delete Confirmation Dialog */}
       <ConfirmDeleteDialog
         open={deleteDialog.open}
         onOpenChange={(open) => setDeleteDialog({ open, company: null })}
         title="Move to Deleted Companies"
         content={`Are you sure you want to move "${deleteDialog.company?.orgn_user.name}" to deleted companies? You can restore it within 30 days before it's permanently deleted.`}
         confirmButtonText="Move to Deleted"
         onConfirm={confirmDelete}
         loading={deleteLoading}
       />